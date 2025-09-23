
'use client';

import { useState } from 'react';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

interface EarlyReturnRule {
  id: string;
  daysRange: string;
  cost: number;
  description: string;
}

interface ShippingZone {
  id: string;
  region: string;
  cost: number;
  estimatedDays: string;
}

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      name: 'Basic Dream',
      description: 'Perfect for first-time dreamers',
      price: 29.99,
      features: ['5 memories', 'Basic templates', 'Email support'],
      isPopular: false
    },
    {
      id: '2',
      name: 'Premium Dream',
      description: 'Most popular choice for families',
      price: 49.99,
      features: ['Unlimited memories', 'Premium templates', 'Priority support', 'Custom themes'],
      isPopular: true
    },
    {
      id: '3',
      name: 'Family Dream',
      description: 'Perfect for large families',
      price: 79.99,
      features: ['Unlimited memories', 'Multiple users', 'Advanced features', '24/7 support'],
      isPopular: false
    }
  ]);

  const [earlyReturnRules, setEarlyReturnRules] = useState<EarlyReturnRule[]>([
    { id: '1', daysRange: 'Less than 30 days', cost: 2.00, description: 'Very early return fee' },
    { id: '2', daysRange: '30-90 days', cost: 5.00, description: 'Early return fee' },
    { id: '3', daysRange: '3-6 months', cost: 15.00, description: 'Medium term return fee' },
    { id: '4', daysRange: '6-12 months', cost: 25.00, description: 'Long term return fee' },
    { id: '5', daysRange: 'Over 1 year', cost: 50.00, description: 'Extended return fee' }
  ]);

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    { id: '1', region: 'Domestic (Same Country)', cost: 5.99, estimatedDays: '2-3 days' },
    { id: '2', region: 'Europe', cost: 12.99, estimatedDays: '5-7 days' },
    { id: '3', region: 'North America', cost: 19.99, estimatedDays: '7-10 days' },
    { id: '4', region: 'Asia Pacific', cost: 24.99, estimatedDays: '10-14 days' },
    { id: '5', region: 'Rest of World', cost: 29.99, estimatedDays: '14-21 days' }
  ]);

  const [vatSettings, setVatSettings] = useState({
    enabled: true,
    rate: 21.0,
    includedInPrice: false,
    vatNumber: 'NL123456789B01'
  });

  const [generalSettings, setGeneralSettings] = useState({
    currency: 'EUR',
    processingFee: 2.50,
    expeditedShipping: 15.00,
    insuranceFee: 8.99,
    packagingFee: 3.50,
    handlingFee: 4.99
  });

  const [activeTab, setActiveTab] = useState('packages');

  const updatePackage = (id: string, field: keyof Package, value: any) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ));
  };

  const updateEarlyReturnRule = (id: string, field: keyof EarlyReturnRule, value: any) => {
    setEarlyReturnRules(rules => rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const updateShippingZone = (id: string, field: keyof ShippingZone, value: any) => {
    setShippingZones(zones => zones.map(zone => 
      zone.id === id ? { ...zone, [field]: value } : zone
    ));
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      name: 'New Package',
      description: 'Package description',
      price: 0,
      features: ['New feature'],
      isPopular: false
    };
    setPackages([...packages, newPackage]);
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const addEarlyReturnRule = () => {
    const newRule: EarlyReturnRule = {
      id: Date.now().toString(),
      daysRange: 'New range',
      cost: 0,
      description: 'New rule description'
    };
    setEarlyReturnRules([...earlyReturnRules, newRule]);
  };

  const removeEarlyReturnRule = (id: string) => {
    setEarlyReturnRules(earlyReturnRules.filter(rule => rule.id !== id));
  };

  const addShippingZone = () => {
    const newZone: ShippingZone = {
      id: Date.now().toString(),
      region: 'New Region',
      cost: 0,
      estimatedDays: '1-2 days'
    };
    setShippingZones([...shippingZones, newZone]);
  };

  const removeShippingZone = (id: string) => {
    setShippingZones(shippingZones.filter(zone => zone.id !== id));
  };

  const saveSettings = () => {
    console.log('Saving pricing settings:', {
      packages,
      earlyReturnRules,
      shippingZones,
      vatSettings,
      generalSettings
    });
    alert('Pricing settings saved successfully!');
  };

  const addFeature = (packageIndex: number) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features.push('New feature');
    setPackages(newPackages);
  };

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features.splice(featureIndex, 1);
    setPackages(newPackages);
  };

  const updateFeature = (packageIndex: number, featureIndex: number, value: string) => {
    const newPackages = [...packages];
    newPackages[packageIndex].features[featureIndex] = value;
    setPackages(newPackages);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-2">Configure packages, shipping costs, VAT settings, and return fees</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'packages', label: 'Dream Packages', icon: 'ri-gift-line' },
                { id: 'shipping', label: 'Shipping Costs', icon: 'ri-truck-line' },
                { id: 'returns', label: 'Early Returns', icon: 'ri-time-line' },
                { id: 'vat', label: 'VAT Settings', icon: 'ri-percent-line' },
                { id: 'general', label: 'General Settings', icon: 'ri-settings-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Dream Packages Tab */}
          {activeTab === 'packages' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Dream Packages</h2>
                <button
                  onClick={addPackage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add Package
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className="border rounded-lg p-6 relative">
                    {pkg.isPopular && (
                      <span className="absolute -top-2 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    )}

                    <div className="mb-4">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                        className="text-lg font-semibold w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-0 mb-2"
                      />
                      <textarea
                        value={pkg.description}
                        onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                        className="text-gray-600 text-sm w-full border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-0 resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl font-bold">€</span>
                        <input
                          type="number"
                          step="0.01"
                          value={pkg.price}
                          onChange={(e) => updatePackage(pkg.id, 'price', parseFloat(e.target.value))}
                          className="text-2xl font-bold border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 p-0 w-20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Features
                      </label>
                      <div className="space-y-2">
                        {pkg.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Feature description"
                            />
                            <button
                              type="button"
                              onClick={() => removeFeature(index, featureIndex)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove feature"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addFeature(index)}
                          className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                          Add Feature
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={pkg.isPopular}
                          onChange={(e) => updatePackage(pkg.id, 'isPopular', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Popular</span>
                      </label>

                      <button
                        onClick={() => removePackage(pkg.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Costs Tab */}
          {activeTab === 'shipping' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shipping Zones</h2>
                <button
                  onClick={addShippingZone}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add Zone
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Region</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Shipping Cost</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Estimated Delivery</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingZones.map((zone) => (
                      <tr key={zone.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={zone.region}
                            onChange={(e) => updateShippingZone(zone.id, 'region', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>€</span>
                            <input
                              type="number"
                              step="0.01"
                              value={zone.cost}
                              onChange={(e) => updateShippingZone(zone.id, 'cost', parseFloat(e.target.value))}
                              className="w-20 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={zone.estimatedDays}
                            onChange={(e) => updateShippingZone(zone.id, 'estimatedDays', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => removeShippingZone(zone.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Early Returns Tab */}
          {activeTab === 'returns' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Early Return Fees</h2>
                  <p className="text-gray-600 text-sm mt-1">Set penalties for early time capsule returns</p>
                </div>
                <button
                  onClick={addEarlyReturnRule}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add Rule
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Time Period</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Return Fee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earlyReturnRules.map((rule) => (
                      <tr key={rule.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={rule.daysRange}
                            onChange={(e) => updateEarlyReturnRule(rule.id, 'daysRange', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>€</span>
                            <input
                              type="number"
                              step="0.01"
                              value={rule.cost}
                              onChange={(e) => updateEarlyReturnRule(rule.id, 'cost', parseFloat(e.target.value))}
                              className="w-20 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={rule.description}
                            onChange={(e) => updateEarlyReturnRule(rule.id, 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => removeEarlyReturnRule(rule.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VAT Settings Tab */}
          {activeTab === 'vat' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">VAT Configuration</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={vatSettings.enabled}
                        onChange={(e) => setVatSettings({ ...vatSettings, enabled: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-lg font-medium text-gray-900">Enable VAT</span>
                    </label>
                    <p className="text-gray-600 text-sm mt-1 ml-6">Apply VAT to all transactions</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT Rate (%)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        value={vatSettings.rate}
                        onChange={(e) => setVatSettings({ ...vatSettings, rate: parseFloat(e.target.value) })}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!vatSettings.enabled}
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                    <input
                      type="text"
                      value={vatSettings.vatNumber}
                      onChange={(e) => setVatSettings({ ...vatSettings, vatNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., NL123456789B01"
                      disabled={!vatSettings.enabled}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={vatSettings.includedInPrice}
                        onChange={(e) => setVatSettings({ ...vatSettings, includedInPrice: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!vatSettings.enabled}
                      />
                      <span className="text-lg font-medium text-gray-900">VAT Included in Prices</span>
                    </label>
                    <p className="text-gray-600 text-sm mt-1 ml-6">
                      {vatSettings.includedInPrice
                        ? 'Prices already include VAT (tax-inclusive)'
                        : 'VAT will be added to prices at checkout (tax-exclusive)'}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">VAT Preview</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Product Price:</span>
                        <span>€49.99</span>
                      </div>
                      {vatSettings.enabled && (
                        <>
                          {!vatSettings.includedInPrice && (
                            <div className="flex justify-between">
                              <span>VAT ({vatSettings.rate}%):</span>
                              <span>€{(49.99 * vatSettings.rate / 100).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                            <span>Total:</span>
                            <span>
                              €{vatSettings.includedInPrice
                                ? '49.99'
                                : (49.99 * (1 + vatSettings.rate / 100)).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">General Pricing Settings</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee</label>
                    <div className="flex items-center space-x-2">
                      <span>€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={generalSettings.processingFee}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, processingFee: parseFloat(e.target.value) })}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expedited Shipping</label>
                    <div className="flex items-center space-x-2">
                      <span>€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={generalSettings.expeditedShipping}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, expeditedShipping: parseFloat(e.target.value) })}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Fee</label>
                    <div className="flex items-center space-x-2">
                      <span>€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={generalSettings.insuranceFee}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, insuranceFee: parseFloat(e.target.value) })}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Fee</label>
                    <div className="flex items-center space-x-2">
                      <span>€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={generalSettings.packagingFee}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, packagingFee: parseFloat(e.target.value) })}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Handling Fee</label>
                    <div className="flex items-center space-x-2">
                      <span>€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={generalSettings.handlingFee}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, handlingFee: parseFloat(e.target.value) })}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Additional Fee Options</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Automatic insurance for orders over €100</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Free shipping for premium customers</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Holiday season surcharge</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Bulk order discounts</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveSettings}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium whitespace-nowrap"
          >
            <i className="ri-save-line mr-2"></i>
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
