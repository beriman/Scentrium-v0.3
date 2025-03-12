import { supabase } from "../../supabase/supabase";

export interface NotificationData {
  user_id: string;
  message: string;
  type: string;
  order_id?: string;
  course_id?: string;
  thread_id?: string;
  reference_id?: string;
}

export class NotificationService {
  /**
   * Send a notification to a user
   */
  static async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      const { error } = await supabase.from("user_notifications").insert({
        user_id: data.user_id,
        message: data.message,
        type: data.type,
        is_read: false,
        order_id: data.order_id,
        course_id: data.course_id,
        thread_id: data.thread_id,
        reference_id: data.reference_id,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }

  /**
   * Send a notification to multiple users
   */
  static async sendBulkNotifications(
    userIds: string[],
    data: Omit<NotificationData, "user_id">,
  ): Promise<boolean> {
    try {
      const notifications = userIds.map((userId) => ({
        user_id: userId,
        message: data.message,
        type: data.type,
        is_read: false,
        order_id: data.order_id,
        course_id: data.course_id,
        thread_id: data.thread_id,
        reference_id: data.reference_id,
      }));

      const { error } = await supabase
        .from("user_notifications")
        .insert(notifications);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error sending bulk notifications:", error);
      return false;
    }
  }

  /**
   * Send an email notification (this would integrate with an email service)
   */
  static async sendEmailNotification(
    email: string,
    subject: string,
    message: string,
  ): Promise<boolean> {
    try {
      // In a real implementation, this would call an email service or API
      // For now, we'll just log it
      console.log(`Email to ${email}: ${subject} - ${message}`);

      // This would be replaced with actual email sending logic
      // const { error } = await supabase.functions.invoke('send-email', {
      //   body: { email, subject, message }
      // });

      return true;
    } catch (error) {
      console.error("Error sending email notification:", error);
      return false;
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("user_notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}
