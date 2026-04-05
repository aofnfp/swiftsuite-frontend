import React, { useState, useEffect } from 'react'
import { ChevronDown, Package, Trash2, Eye, AlertCircle, Loader, Lock, Search, X } from 'lucide-react'

const HeldSKU = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedAccount, setExpandedAccount] = useState(null)
  const [heldSkus, setHeldSkus] = useState({})
  const [skuDetails, setSkuDetails] = useState({})
  const [selectedSku, setSelectedSku] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deletingSkus, setDeletingSkus] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const getToken = () => localStorage.getItem('token')

  // Fetch vendor accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = getToken()

        const response = await fetch(
          'https://service.swiftsuite.app/api/v2/vendor-account/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!response.ok) throw new Error('Failed to fetch accounts')
        const data = await response.json()
        setAccounts(data)

        // Fetch held SKUs for all accounts
        const allSkus = {}
        for (const account of data) {
          try {
            const skuResponse = await fetch(
              `https://service.swiftsuite.app/orderApp/held-sku/${account.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            if (skuResponse.ok) {
              const skuData = await skuResponse.json()
              allSkus[account.id] = skuData.held_skus || []
            }
          } catch (err) {
            console.error(`Error fetching SKUs for account ${account.id}:`, err)
          }
        }
        setHeldSkus(allSkus)
      } catch (err) {
        setError(err.message || 'Error loading accounts')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  // Fetch held SKUs for an account
  const fetchHeldSkus = async (accountId) => {
    try {
      const token = getToken()
      const response = await fetch(
        `https://service.swiftsuite.app/orderApp/held-sku/${accountId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch SKUs')
      const data = await response.json()
      setHeldSkus((prev) => ({
        ...prev,
        [accountId]: data.held_skus || [],
      }))
    } catch (err) {
      setError(`Error loading SKUs: ${err.message}`)
    }
  }

  // Fetch SKU details
  const fetchSkuDetails = async (accountId, sku) => {
    try {
      setDetailsLoading(true)
      const token = getToken()
      const response = await fetch(
        `https://service.swiftsuite.app/orderApp/held-sku/${accountId}/${sku}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch SKU details')
      const data = await response.json()
      setSkuDetails((prev) => ({
        ...prev,
        [`${accountId}-${sku}`]: data,
      }))
      setSelectedSku({ accountId, sku })
    } catch (err) {
      setError(`Error loading SKU details: ${err.message}`)
    } finally {
      setDetailsLoading(false)
    }
  }

  // Delete SKU
  const deleteSku = async (accountId, sku) => {
    try {
      setDeletingSkus((prev) => new Set([...prev, `${accountId}-${sku}`]))
      const token = getToken()
      const response = await fetch(
        `https://service.swiftsuite.app/orderApp/held-sku/${accountId}/${sku}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to delete SKU')
      // Refresh the held SKUs for this account
      await fetchHeldSkus(accountId)
      setSelectedSku(null)
    } catch (err) {
      setError(`Error deleting SKU: ${err.message}`)
    } finally {
      setDeletingSkus((prev) => {
        const newSet = new Set(prev)
        newSet.delete(`${accountId}-${sku}`)
        return newSet
      })
    }
  }

  const toggleAccount = async (accountId) => {
    if (expandedAccount === accountId) {
      setExpandedAccount(null)
    } else {
      setExpandedAccount(accountId)
      if (!heldSkus[accountId]) {
        await fetchHeldSkus(accountId)
      }
    }
  }

  // Filter accounts and SKUs based on search query
  const filteredAccounts = accounts.filter((account) => {
    const accountMatches = account.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const skusForAccount = heldSkus[account.id] || []
    const skuMatches = skusForAccount.some((sku) =>
      sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return accountMatches || skuMatches
  })

  if (loading) {
    return (
 <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className="relative w-16 h-16 rounded-full border-4 border-gray-200"
              style={{ borderTopColor: '#027840' }}
            >
              <Loader className="w-12 h-12 animate-spin mx-auto mt-2" style={{ color: '#027840' }} />
            </div>
          </div>
          <p className="text-gray-700 text-lg font-medium">Loading vendor accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-0 md:my-[7rem] mx-0 md:mx-10 bg-gradient-to-br from-white via-gray-50 to-white p-[4rem] md:p-[4rem]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#02784015' }}>
              <Lock className="w-8 h-8" style={{ color: '#027840' }} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Held SKU Management
              </h1>
              <p className="text-gray-600 text-base mt-1">
                Monitor and manage SKU
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search account or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-300 transition-colors bg-white text-gray-900 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-xs text-gray-600">
                Found {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="h-1 w-20 rounded-full mt-6" style={{ backgroundColor: '#027840' }}></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-lg flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="p-12 rounded-xl border-2 border-dashed border-gray-200 text-center bg-gray-50">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">
                    No vendor accounts found
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Connect your first vendor account to get started
                  </p>
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="p-12 rounded-xl border-2 border-dashed border-gray-200 text-center bg-gray-50">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">
                    No results found
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try searching with a different account name or SKU
                  </p>
                </div>
              ) : (
                filteredAccounts.map((account, idx) => {
                  const skuCount = heldSkus[account.id]?.length || 0
                  const accountSkus = heldSkus[account.id] || []
                  const filteredSkus = searchQuery
                    ? accountSkus.filter((sku) =>
                        sku.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    : accountSkus

                  return (
                    <div
                      key={account.id}
                      className="rounded-xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                      style={{
                        animation: `slideIn 0.4s ease-out ${idx * 50}ms backwards`,
                      }}
                    >
                      <style>{`
                        @keyframes slideIn {
                          from {
                            opacity: 0;
                            transform: translateY(20px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }
                      `}</style>
                      {/* Account Header */}
                      <button
                        onClick={() => toggleAccount(account.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-5 flex-1 text-left">
                          <div
                            className="p-4 rounded-lg text-white font-bold text-xl w-16 h-16 flex items-center justify-center"
                            style={{ backgroundColor: '#027840' }}
                          >
                            {account.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {account.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-2">
                              <span
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                                style={{ backgroundColor: '#027840' }}
                              >
                                <Lock className="w-4 h-4" />
                                {skuCount} SKU{skuCount !== 1 ? 's' : ''} Held
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronDown
                          className="w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0"
                          style={{
                            transform: expandedAccount === account.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </button>

                      {/* Held SKUs Section */}
                      {expandedAccount === account.id && (
                        <div className="border-t-2 border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                          {accountSkus && accountSkus.length > 0 ? (
                            <div className="p-6 space-y-4">
                              <p className="text-gray-700 text-sm font-bold uppercase tracking-wider">
                                Held SKUs
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {accountSkus.map((sku, skuIdx) => (
                                  <div
                                    key={`${account.id}-${sku}`}
                                    className="flex items-center gap-2 animate-fadeIn"
                                    style={{
                                      animation: `slideUp 0.3s ease-out ${skuIdx * 80}ms backwards`,
                                    }}
                                  >
                                    <style>{`
                                      @keyframes slideUp {
                                        from {
                                          opacity: 0;
                                          transform: translateY(10px);
                                        }
                                        to {
                                          opacity: 1;
                                          transform: translateY(0);
                                        }
                                      }
                                    `}</style>
                                    <button
                                      onClick={() =>
                                        fetchSkuDetails(account.id, sku)
                                      }
                                      className="px-4 py-3 border-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 hover:shadow-md"
                                      style={{
                                        borderColor: '#027840',
                                        color: '#027840',
                                        backgroundColor:
                                          selectedSku?.sku === sku &&
                                          selectedSku?.accountId === account.id
                                            ? '#02784015'
                                            : 'transparent',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#027840'
                                        e.target.style.color = 'white'
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor =
                                          selectedSku?.sku === sku &&
                                          selectedSku?.accountId === account.id
                                            ? '#02784015'
                                            : 'transparent'
                                        e.target.style.color = '#027840'
                                      }}
                                    >
                                      <span className="font-mono">{sku}</span>
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteSku(account.id, sku)
                                      }
                                      disabled={deletingSkus.has(
                                        `${account.id}-${sku}`
                                      )}
                                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Remove SKU"
                                    >
                                      {deletingSkus.has(`${account.id}-${sku}`) ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-8 text-center text-gray-500 py-10">
                              <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                              <p className="text-sm font-medium">
                                No held SKUs for this account
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* SKU Details Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border-2 border-gray-200 p-8 bg-white shadow-sm h-fit sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                SKU Details
              </h3>

              {selectedSku ? (
                <div className="space-y-5">
                  {detailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative w-12 h-12 mb-4">
                        <div
                          className="absolute inset-0 rounded-full border-3 border-gray-200"
                          style={{ borderTopColor: '#027840' }}
                        >
                          <Loader className="w-6 h-6 animate-spin" style={{ color: '#027840' }} />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm font-medium">Loading details...</p>
                    </div>
                  ) : (
                    <>
                      <div
                        className="rounded-lg p-5 border-2"
                        style={{
                          borderColor: '#02784040',
                          backgroundColor: '#02784008',
                        }}
                      >
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">
                          SKU Number
                        </p>
                        <p className="text-2xl font-bold font-mono" style={{ color: '#027840' }}>
                          {selectedSku.sku}
                        </p>
                      </div>

                      {skuDetails[`${selectedSku.accountId}-${selectedSku.sku}`] && (
                        <div className="rounded-lg p-5 space-y-4 border-2 border-gray-100 bg-gray-50">
                          {Object.entries(
                            skuDetails[
                              `${selectedSku.accountId}-${selectedSku.sku}`
                            ]
                          )
                            .filter(([key]) => key !== 'sku')
                            .map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <p className="text-gray-600 text-xs uppercase tracking-widest font-bold mb-2">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-gray-900 font-mono break-words bg-white p-3 rounded border border-gray-200">
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}

                      <button
                        onClick={() =>
                          deleteSku(selectedSku.accountId, selectedSku.sku)
                        }
                        disabled={deletingSkus.has(
                          `${selectedSku.accountId}-${selectedSku.sku}`
                        )}
                        className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold transition-all hover:shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                      >
                        {deletingSkus.has(
                          `${selectedSku.accountId}-${selectedSku.sku}`
                        ) ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Removing...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Remove SKU</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Select a SKU to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeldSKU