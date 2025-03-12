import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Percent, Save, Share2 } from "lucide-react";

export default function FinancialCalculator() {
  const [calculatorType, setCalculatorType] = useState("profit");

  // Profit Calculator State
  const [sellingPrice, setSellingPrice] = useState(350000);
  const [productionCost, setProductionCost] = useState(175000);
  const [marketingCost, setMarketingCost] = useState(35000);
  const [otherCosts, setOtherCosts] = useState(15000);
  const [quantity, setQuantity] = useState(100);

  // Pricing Calculator State
  const [costPrice, setCostPrice] = useState(200000);
  const [targetMargin, setTargetMargin] = useState(40);
  const [competitorPrice, setCompetitorPrice] = useState(350000);

  // Production Cost Calculator State
  const [materialCost, setMaterialCost] = useState(120000);
  const [laborCost, setLaborCost] = useState(50000);
  const [packagingCost, setPackagingCost] = useState(30000);
  const [overheadCost, setOverheadCost] = useState(20000);
  const [batchSize, setBatchSize] = useState(50);

  // Results
  const [profitResults, setProfitResults] = useState<any>(null);
  const [pricingResults, setPricingResults] = useState<any>(null);
  const [productionResults, setProductionResults] = useState<any>(null);

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate profit results
  useEffect(() => {
    const totalCostPerUnit = productionCost + marketingCost + otherCosts;
    const profitPerUnit = sellingPrice - totalCostPerUnit;
    const totalRevenue = sellingPrice * quantity;
    const totalCost = totalCostPerUnit * quantity;
    const totalProfit = profitPerUnit * quantity;
    const profitMargin = (profitPerUnit / sellingPrice) * 100;
    const roi = (totalProfit / totalCost) * 100;

    setProfitResults({
      totalCostPerUnit,
      profitPerUnit,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      roi,
    });
  }, [sellingPrice, productionCost, marketingCost, otherCosts, quantity]);

  // Calculate pricing results
  useEffect(() => {
    const recommendedPrice = costPrice / (1 - targetMargin / 100);
    const priceDifference = recommendedPrice - competitorPrice;
    const priceDifferencePercentage = (priceDifference / competitorPrice) * 100;
    const marginAtCompetitorPrice =
      ((competitorPrice - costPrice) / competitorPrice) * 100;

    setPricingResults({
      recommendedPrice,
      priceDifference,
      priceDifferencePercentage,
      marginAtCompetitorPrice,
    });
  }, [costPrice, targetMargin, competitorPrice]);

  // Calculate production cost results
  useEffect(() => {
    const totalBatchCost =
      materialCost + laborCost + packagingCost + overheadCost;
    const costPerUnit = totalBatchCost / batchSize;
    const materialPercentage = (materialCost / totalBatchCost) * 100;
    const laborPercentage = (laborCost / totalBatchCost) * 100;
    const packagingPercentage = (packagingCost / totalBatchCost) * 100;
    const overheadPercentage = (overheadCost / totalBatchCost) * 100;

    setProductionResults({
      totalBatchCost,
      costPerUnit,
      materialPercentage,
      laborPercentage,
      packagingPercentage,
      overheadPercentage,
    });
  }, [materialCost, laborCost, packagingCost, overheadCost, batchSize]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Financial Calculator
        </h1>
        <p className="text-gray-500">
          Calculate costs, pricing, and profitability for your perfume business
        </p>
      </div>

      <Tabs value={calculatorType} onValueChange={setCalculatorType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profit">Profit Calculator</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Calculator</TabsTrigger>
          <TabsTrigger value="production">
            Production Cost Calculator
          </TabsTrigger>
        </TabsList>

        {/* Profit Calculator */}
        <TabsContent value="profit" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit Calculator</CardTitle>
                <CardDescription>
                  Calculate profit and margins based on costs and selling price
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selling-price">Selling Price (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="selling-price"
                      type="number"
                      className="pl-10"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="production-cost">Production Cost (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="production-cost"
                      type="number"
                      className="pl-10"
                      value={productionCost}
                      onChange={(e) =>
                        setProductionCost(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketing-cost">Marketing Cost (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="marketing-cost"
                      type="number"
                      className="pl-10"
                      value={marketingCost}
                      onChange={(e) => setMarketingCost(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other-costs">Other Costs (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="other-costs"
                      type="number"
                      className="pl-10"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Units)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
                <CardDescription>Results based on your inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profitResults && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Total Cost Per Unit
                        </p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(profitResults.totalCostPerUnit)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Profit Per Unit</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(profitResults.profitPerUnit)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(profitResults.totalRevenue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Total Cost</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(profitResults.totalCost)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Total Profit</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(profitResults.totalProfit)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Profit Margin</p>
                        <p className="text-lg font-semibold">
                          {profitResults.profitMargin.toFixed(2)}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">ROI</p>
                        <p className="text-lg font-semibold">
                          {profitResults.roi.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Profit Breakdown
                      </p>
                      <div className="w-full h-6 rounded-md overflow-hidden flex">
                        <div
                          className="bg-blue-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${(productionCost / sellingPrice) * 100}%`,
                          }}
                        >
                          Production
                        </div>
                        <div
                          className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${(marketingCost / sellingPrice) * 100}%`,
                          }}
                        >
                          Marketing
                        </div>
                        <div
                          className="bg-orange-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${(otherCosts / sellingPrice) * 100}%`,
                          }}
                        >
                          Other
                        </div>
                        <div
                          className="bg-green-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${(profitResults.profitPerUnit / sellingPrice) * 100}%`,
                          }}
                        >
                          Profit
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Calculator */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Calculator</CardTitle>
                <CardDescription>
                  Calculate optimal pricing based on costs and target margin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cost-price">Cost Price (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cost-price"
                      type="number"
                      className="pl-10"
                      value={costPrice}
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-margin">
                    Target Profit Margin (%)
                  </Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="target-margin"
                      type="number"
                      className="pl-10"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Margin Slider</Label>
                  <Slider
                    value={[targetMargin]}
                    min={0}
                    max={80}
                    step={1}
                    onValueChange={(value) => setTargetMargin(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>20%</span>
                    <span>40%</span>
                    <span>60%</span>
                    <span>80%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitor-price">
                    Competitor Price (IDR)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="competitor-price"
                      type="number"
                      className="pl-10"
                      value={competitorPrice}
                      onChange={(e) =>
                        setCompetitorPrice(Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Analysis</CardTitle>
                <CardDescription>Results based on your inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {pricingResults && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        Recommended Selling Price
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(pricingResults.recommendedPrice)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Based on your cost and target margin
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Competitor Price
                        </p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(competitorPrice)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Price Difference
                        </p>
                        <p
                          className={`text-lg font-semibold ${pricingResults.priceDifference > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {pricingResults.priceDifference > 0 ? "+" : ""}
                          {formatCurrency(pricingResults.priceDifference)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Your Target Margin
                        </p>
                        <p className="text-lg font-semibold">{targetMargin}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Margin at Competitor Price
                        </p>
                        <p
                          className={`text-lg font-semibold ${pricingResults.marginAtCompetitorPrice < targetMargin ? "text-red-600" : "text-green-600"}`}
                        >
                          {pricingResults.marginAtCompetitorPrice.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Price Comparison
                      </p>
                      <div className="relative pt-6 pb-2">
                        <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>
                            {formatCurrency(
                              Math.max(
                                pricingResults.recommendedPrice,
                                competitorPrice,
                              ) * 1.2,
                            )}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 relative">
                          {/* Cost Price Marker */}
                          <div
                            className="absolute h-4 w-4 bg-gray-600 rounded-full -top-1 -ml-2"
                            style={{
                              left: `${(costPrice / (Math.max(pricingResults.recommendedPrice, competitorPrice) * 1.2)) * 100}%`,
                            }}
                          ></div>
                          <div
                            className="absolute -top-8 transform -translate-x-1/2 bg-gray-600 text-white text-xs py-1 px-2 rounded"
                            style={{
                              left: `${(costPrice / (Math.max(pricingResults.recommendedPrice, competitorPrice) * 1.2)) * 100}%`,
                            }}
                          >
                            Cost: {formatCurrency(costPrice)}
                          </div>

                          {/* Recommended Price Marker */}
                          <div
                            className="absolute h-4 w-4 bg-purple-600 rounded-full -top-1 -ml-2"
                            style={{
                              left: `${(pricingResults.recommendedPrice / (Math.max(pricingResults.recommendedPrice, competitorPrice) * 1.2)) * 100}%`,
                            }}
                          ></div>
                          <div
                            className="absolute -top-8 transform -translate-x-1/2 bg-purple-600 text-white text-xs py-1 px-2 rounded"
                            style={{
                              left: `${(pricingResults.recommendedPrice / (Math.max(pricingResults.recommendedPrice, competitorPrice) * 1.2)) * 100}%`,
                            }}
                          >
                            Recommended:{" "}
                            {formatCurrency(pricingResults.recommendedPrice)}
                          </div>

                          {/* Competitor Price Marker */}
                          <div
                            className="absolute h-4 w-4 bg-blue-600 rounded-full -top-1 -ml-2"
                            style={{
                              left: `${(competitorPrice / (Math.max(pricingResults.recommendedPrice, competitorPrice) * 1.2)) * 100}%`,
                            }}
                          ></div>
                          <div
                            className="absolute -top-8 transform -translate-x-1/2 bg-blue-600 text-white text-xs py-1 px-2 rounded"
                            style={{
                              left: `${(competitorPrice / (Math.max(pricingResults.recommendedPrice, competitorPrice) * 1.2)) * 100}%`,
                            }}
                          >
                            Competitor: {formatCurrency(competitorPrice)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Pricing Strategy Recommendation
                      </p>
                      <p className="text-sm">
                        {pricingResults.priceDifference > 0 &&
                        pricingResults.priceDifferencePercentage > 10
                          ? "Your recommended price is significantly higher than competitors. Consider lowering your target margin or finding ways to add more value to justify the premium price."
                          : pricingResults.priceDifference < 0 &&
                              Math.abs(
                                pricingResults.priceDifferencePercentage,
                              ) > 10
                            ? "Your recommended price is significantly lower than competitors. You may have an opportunity to increase your margin while remaining competitive."
                            : "Your recommended price is close to the competitor price, which suggests your pricing strategy is competitive in the current market."}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Production Cost Calculator */}
        <TabsContent value="production" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Cost Calculator</CardTitle>
                <CardDescription>
                  Calculate the cost of producing your perfume products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="material-cost">Raw Material Cost (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="material-cost"
                      type="number"
                      className="pl-10"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labor-cost">Labor Cost (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="labor-cost"
                      type="number"
                      className="pl-10"
                      value={laborCost}
                      onChange={(e) => setLaborCost(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packaging-cost">Packaging Cost (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="packaging-cost"
                      type="number"
                      className="pl-10"
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overhead-cost">Overhead Cost (IDR)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="overhead-cost"
                      type="number"
                      className="pl-10"
                      value={overheadCost}
                      onChange={(e) => setOverheadCost(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Size (Units)</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Cost Analysis</CardTitle>
                <CardDescription>Results based on your inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {productionResults && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Total Batch Cost</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(productionResults.totalBatchCost)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Cost Per Unit</p>
                      <p className="text-xl font-semibold">
                        {formatCurrency(productionResults.costPerUnit)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Based on a batch size of {batchSize} units
                      </p>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Cost Breakdown
                      </p>
                      <div className="w-full h-6 rounded-md overflow-hidden flex">
                        <div
                          className="bg-blue-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${productionResults.materialPercentage}%`,
                          }}
                        >
                          Materials
                        </div>
                        <div
                          className="bg-green-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${productionResults.laborPercentage}%`,
                          }}
                        >
                          Labor
                        </div>
                        <div
                          className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${productionResults.packagingPercentage}%`,
                          }}
                        >
                          Packaging
                        </div>
                        <div
                          className="bg-red-500 h-full flex items-center justify-center text-xs text-white"
                          style={{
                            width: `${productionResults.overheadPercentage}%`,
                          }}
                        >
                          Overhead
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Materials</p>
                        <p className="text-base font-medium">
                          {formatCurrency(materialCost)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {productionResults.materialPercentage.toFixed(1)}% of
                          total
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Labor</p>
                        <p className="text-base font-medium">
                          {formatCurrency(laborCost)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {productionResults.laborPercentage.toFixed(1)}% of
                          total
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Packaging</p>
                        <p className="text-base font-medium">
                          {formatCurrency(packagingCost)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {productionResults.packagingPercentage.toFixed(1)}% of
                          total
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Overhead</p>
                        <p className="text-base font-medium">
                          {formatCurrency(overheadCost)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {productionResults.overheadPercentage.toFixed(1)}% of
                          total
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Cost Optimization Tips
                      </p>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        {productionResults.materialPercentage > 50 && (
                          <li>
                            Your material costs are high. Consider bulk
                            purchasing or finding alternative suppliers.
                          </li>
                        )}
                        {productionResults.laborPercentage > 30 && (
                          <li>
                            Labor costs are significant. Look into optimizing
                            production processes or automation.
                          </li>
                        )}
                        {productionResults.packagingPercentage > 25 && (
                          <li>
                            Packaging costs are high. Consider simpler packaging
                            or bulk ordering.
                          </li>
                        )}
                        {productionResults.overheadPercentage > 20 && (
                          <li>
                            Overhead costs are high. Review fixed costs and look
                            for areas to reduce expenses.
                          </li>
                        )}
                        {productionResults.costPerUnit > 250000 && (
                          <li>
                            Your cost per unit is relatively high. Increasing
                            batch size could help reduce unit costs.
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" /> Save Calculation
        </Button>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <Button className="bg-purple-700 hover:bg-purple-800 gap-2">
          <Calculator className="h-4 w-4" /> New Calculation
        </Button>
      </div>
    </div>
  );
}
