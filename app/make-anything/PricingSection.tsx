
'use client';

import { useState } from 'react';

export default function PricingSection() {
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColors, setSelectedColors] = useState(0);
  const [humanReview, setHumanReview] = useState(false);

  const sizes = [
    {
      id: 0,
      name: "Small",
      dimensions: "8–12 cm max edge",
      price: 30,
      description: "Perfect for keychains, desk ornaments, gifts",
      examples: "Keychains, miniatures, ornaments",
      popular: false
    },
    {
      id: 1,
      name: "Medium",
      dimensions: "15–18 cm max edge", 
      price: 50,
      description: "Ideal for display pieces, memorable gifts",
      examples: "Desk statues, display models, gifts",
      popular: true
    },
    {
      id: 2,
      name: "Large",
      dimensions: "up to 25×25×25 cm",
      price: 80,
      description: "Statement pieces, centerpieces, trophies",
      examples: "Display pieces, centerpieces, awards",
      popular: false
    }
  ];

  const colorTiers = [
    { id: 0, colors: 1, multiplier: 1.0, name: "Single Color", description: "Classic solid color finish", priceText: "Base price" },
    { id: 1, colors: 4, multiplier: 1.25, name: "4 Colors", description: "Multi-color details", priceText: "+25%" },
    { id: 2, colors: 8, multiplier: 1.50, name: "8 Colors", description: "Rich color variety", priceText: "+50%" },
    { id: 3, colors: 12, multiplier: 1.75, name: "12 Colors", description: "Highly detailed coloring", priceText: "+75%" },
    { id: 4, colors: 16, multiplier: 2.00, name: "16+ Colors", description: "Full spectrum printing", priceText: "+100%" },
    { id: 5, colors: 'human', multiplier: 4.00, name: "Human Coloring", description: "Hand-painted professional finish", priceText: "+300%" }
  ];

  const calculatePrice = (basePrice: number, multiplier: number) => {
    return (basePrice * multiplier).toFixed(2);
  };

  const basePrice = parseFloat(calculatePrice(sizes[selectedSize].price, colorTiers[selectedColors].multiplier));
  const reviewPrice = humanReview ? 16 : 0;
  const totalPrice = (basePrice + reviewPrice).toFixed(2);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Transparent pricing — no hidden costs
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose your size and colors. Price updates instantly. What you see is what you pay.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Configure your print</h3>
              
              {/* Size Selection */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose size:</h4>
                <div className="grid gap-3">
                  {sizes.map((size) => (
                    <div
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedSize === size.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size.popular && (
                        <div className="absolute -top-2 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-900">{size.name}</h5>
                          <p className="text-gray-600 text-sm">{size.dimensions}</p>
                          <p className="text-gray-500 text-xs mt-1">{size.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">€{size.price}</div>
                          <div className="text-xs text-gray-500">base price</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection - Compact Grid */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose colors:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {colorTiers.map((color) => (
                    <div
                      key={color.id}
                      onClick={() => setSelectedColors(color.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedColors === color.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-semibold text-gray-900 text-sm">{color.name}</h5>
                          <div className="text-xs font-medium text-gray-900">{color.priceText}</div>
                        </div>
                        <p className="text-gray-600 text-xs">{color.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Services - Compact */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional services:</h4>
                <div
                  onClick={() => setHumanReview(!humanReview)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    humanReview
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          humanReview ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {humanReview && <i className="ri-check-line text-white text-xs"></i>}
                        </div>
                        <h5 className="font-semibold text-gray-900 text-sm">Human Review</h5>
                      </div>
                      <p className="text-gray-600 text-xs mt-1 ml-6">Expert fixes minor model problems</p>
                    </div>
                    <div className="text-xs font-medium text-gray-900">+€16</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your price</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{sizes[selectedSize].name} size</span>
                  <span className="font-medium">€{sizes[selectedSize].price.toFixed(2)}</span>
                </div>
                
                {colorTiers[selectedColors].multiplier > 1 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{colorTiers[selectedColors].name}</span>
                    <span className="font-medium">×{colorTiers[selectedColors].multiplier}</span>
                  </div>
                )}
                
                {humanReview && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Human Review</span>
                    <span className="font-medium">+€16.00</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">€{totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span>Free preview before payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span>One free round of adjustments</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span>Quality guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-check-line text-green-600"></i>
                  <span>7-10 day delivery</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer">
                Start with this configuration
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Upload your image to see the live 3D preview
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <i className="ri-information-line text-yellow-600 text-xl"></i>
            <h4 className="font-semibold text-gray-900">Important pricing information</h4>
          </div>
          <p className="text-gray-700 mb-4">
            Prices are for standard geometry. Highly complex designs may require a custom quote. 
            You'll know the exact price before approving your order.
          </p>
          <p className="text-sm text-gray-600">
            All prices include VAT. Free shipping on orders over €50 within EU.
          </p>
        </div>
      </div>
    </section>
  );
}
