import { supabase, MarketplaceProduct, MarketplaceOrder, MarketplaceOrderItem } from './supabase';

// Products
export async function getProducts(category?: string, location?: string, listingType?: string, minPrice?: number, maxPrice?: number) {
  try {
    let query = supabase
      .from('marketplace_products')
      .select('*, user:profiles(*)');

    if (category) {
      query = query.eq('category', category);
    }

    if (location) {
      query = query.eq('location', location);
    }

    if (listingType) {
      query = query.eq('listing_type', listingType);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error getting products:', error);
    return { data: null, error };
  }
}

export async function getProduct(productId: string) {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*, user:profiles(*)')
      .eq('id', productId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error getting product:', error);
    return { data: null, error };
  }
}

export async function getUserProducts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error getting user products:', error);
    return { data: null, error };
  }
}

export async function createProduct(
  userId: string,
  name: string,
  description: string,
  price: number,
  stock: number,
  category: string,
  location?: string,
  listingType: 'regular' | 'sambatan' = 'regular',
  images: string[] = []
) {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .insert([
        {
          user_id: userId,
          name,
          description,
          price,
          stock,
          category,
          location,
          listing_type: listingType,
          images,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update business stats
    await updateBusinessStats(userId);

    return { data, error: null };
  } catch (error) {
    console.error('Error creating product:', error);
    return { data: null, error };
  }
}

export async function updateProduct(
  productId: string,
  updates: Partial<MarketplaceProduct>
) {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating product:', error);
    return { data: null, error };
  }
}

export async function deleteProduct(productId: string) {
  try {
    // Get product to get user_id
    const { data: product, error: productError } = await supabase
      .from('marketplace_products')
      .select('user_id')
      .eq('id', productId)
      .single();

    if (productError) throw productError;

    const { data, error } = await supabase
      .from('marketplace_products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    // Update business stats
    if (product) {
      await updateBusinessStats(product.user_id);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { data: null, error };
  }
}

export async function uploadProductImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('marketplace')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('marketplace').getPublicUrl(filePath);

    return { data: data.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading product image:', error);
    return { data: null, error };
  }
}

// Orders
export async function createOrder(
  buyerId: string,
  sellerId: string,
  items: { productId: string; quantity: number; price: number }[],
  shippingAddress: string
) {
  try {
    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .insert([
        {
          buyer_id: buyerId,
          seller_id: sellerId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('marketplace_order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update product stock
    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from('marketplace_products')
        .select('stock')
        .eq('id', item.productId)
        .single();

      if (productError) throw productError;

      const newStock = Math.max(0, (product.stock || 0) - item.quantity);

      const { error: updateError } = await supabase
        .from('marketplace_products')
        .update({ stock: newStock })
        .eq('id', item.productId);

      if (updateError) throw updateError;
    }

    // Create notification for seller
    await supabase.from('notifications').insert([
      {
        user_id: sellerId,
        type: 'new_order',
        content: 'You have a new order',
        related_id: order.id,
      },
    ]);

    return { data: order, error: null };
  } catch (error) {
    console.error('Error creating order:', error);
    return { data: null, error };
  }
}

export async function getBuyerOrders(buyerId: string) {
  try {
    const { data, error } = await supabase
      .from('marketplace_orders')
      .select('*, seller:profiles(*)')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error getting buyer orders:', error);
    return { data: null, error };
  }
}

export async function getSellerOrders(sellerId: string) {
  try {
    const { data, error } = await supabase
      .from('marketplace_orders')
      .select('*, buyer:profiles(*)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error getting seller orders:', error);
    return { data: null, error };
  }
}

export async function getOrder(orderId: string) {
  try {
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .select('*, buyer:profiles(*), seller:profiles(*)')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabase
      .from('marketplace_order_items')
      .select('*, product:marketplace_products(*)')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    return { data: { ...order, items }, error: null };
  } catch (error) {
    console.error('Error getting order:', error);
    return { data: null, error };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
) {
  try {
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .select('buyer_id, seller_id, status')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const { data, error } = await supabase
      .from('marketplace_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for buyer or seller
    let notificationUserId;
    let notificationContent;

    if (status === 'paid') {
      notificationUserId = order.seller_id;
      notificationContent = 'Payment for your order has been confirmed';
    } else if (status === 'shipped') {
      notificationUserId = order.buyer_id;
      notificationContent = 'Your order has been shipped';
    } else if (status === 'completed') {
      notificationUserId = order.seller_id;
      notificationContent = 'Order has been completed';

      // Update business stats when order is completed
      await updateBusinessStats(order.seller_id);
    } else if (status === 'cancelled') {
      notificationUserId =
        order.status === 'pending' ? order.seller_id : order.buyer_id;
      notificationContent = 'Order has been cancelled';
    }

    if (notificationUserId && notificationContent) {
      await supabase.from('notifications').insert([
        {
          user_id: notificationUserId,
          type: 'order_update',
          content: notificationContent,
          related_id: orderId,
        },
      ]);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { data: null, error };
  }
}

export async function uploadPaymentProof(orderId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Math.random()}.${fileExt}`;
    const filePath = `payments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('marketplace')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('marketplace').getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('marketplace_orders')
      .update({ payment_proof: data.publicUrl })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return { data: data.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    return { data: null, error };
  }
}

// Business Stats
async function updateBusinessStats(userId: string) {
  try {
    // Get total products
    const { data: products, error: productsError } = await supabase
      .from('marketplace_products')
      .select('id')
      .eq('user_id', userId);

    if (productsError) throw productsError;

    // Get total sales and customers
    const { data: orders, error: ordersError } = await supabase
      .from('marketplace_orders')
      .select('id, total_amount, buyer_id')
      .eq('seller_id', userId)
      .eq('status', 'completed');

    if (ordersError) throw ordersError;

    const totalSales = orders?.reduce(
      (total, order) => total + (order.total_amount || 0),
      0
    );

    const uniqueCustomers = new Set(
      orders?.map((order) => order.buyer_id) || []
    );

    // Check if stats exist
    const { data: existingStats, error: statsError } = await supabase
      .from('business_stats')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (statsError && statsError.code !== 'PGRST116') throw statsError;

    if (existingStats) {
      // Update existing stats
      await supabase
        .from('business_stats')
        .update({
          total_products: products?.length || 0,
          total_sales: totalSales || 0,
          total_customers: uniqueCustomers.size,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingStats.id);
    } else {
      // Create new stats
      await supabase.from('business_stats').insert([
        {
          user_id: userId,
          total_products: products?.length