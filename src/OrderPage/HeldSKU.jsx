import React, { useState, useEffect } from 'react'
import { ChevronDown, Package, Trash2, Eye, AlertCircle, Loader, Lock, Search, X, Plus } from 'lucide-react'

const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="rounded-lg md:rounded-xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm animate-pulse"
        >
          <div className="p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                <div className="h-5 md:h-6 w-32 md:w-40 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-4 md:h-5 w-24 md:w-32 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  )
}

const AddSKUModal = ({ isOpen, accountId, accountName, onClose, onSkuAdded }) => {
  const [skuInput, setSkuInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAddSku = async () => {
    if (!skuInput.trim()) {
      setError('Please enter a SKU')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')

      const response = await fetch(
        `https://service.swiftsuite.app/orderApp/held-sku/${accountId}/${skuInput.trim()}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add SKU')
      }

      setSkuInput('')
      onSkuAdded()
      onClose()
    } catch (err) {
      setError(err.message || 'Error adding SKU')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAddSku()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg md:rounded-xl shadow-xl w-full max-w-md"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b-2 border-gray-100 flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">Add SKU</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-5">
          <div>
            <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
              Adding SKU to <span className="font-bold text-gray-900">{accountName}</span>
            </p>
          </div>

          {error && (
            <div className="p-3 md:p-4 border-l-4 border-red-500 bg-red-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-xs md:text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-900">
              SKU Number
            </label>
            <input
              type="text"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter SKU (e.g., SKU-12345)"
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-emerald-700 transition-colors bg-white text-gray-900 font-mono text-sm"
              disabled={loading}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t-2 border-gray-100 flex gap-2 md:gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 text-gray-900 rounded-lg font-bold text-sm md:text-base transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSku}
            disabled={loading}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-sm md:text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add SKU</span>
              </>
            )}
          </button>
        </div>

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
      </div>
    </div>
  )
}

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
  const [addSkuModal, setAddSkuModal] = useState({ isOpen: false, accountId: null, accountName: null })

  const getToken = () => localStorage.getItem('token')

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
      <div className="my-0 md:my-28 mx-0 md:mx-10 bg-gradient-to-br from-white via-gray-50 to-white p-4 md:p-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                <div className="h-8 md:h-10 w-48 md:w-64 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-4 md:h-5 w-40 md:w-48 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <SkeletonLoader />
            </div>

            {/* Details Panel Skeleton */}
            <div className="lg:col-span-1">
              <div className="rounded-lg md:rounded-xl border-2 border-gray-200 p-6 md:p-8 bg-white shadow-sm h-fit animate-pulse">
                <div className="h-6 w-32 rounded-lg bg-gray-200 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="h-4 w-24 rounded-lg bg-gray-200" />
                      <div className="h-12 w-full rounded-lg bg-gray-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-0 md:my-28 mx-0 md:mx-10 bg-gradient-to-br from-white via-gray-50 to-white p-4 md:p-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-12">
           <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 md:mt-0 mt-14">
            <div className="p-2 md:p-3 rounded-lg bg-emerald-50 flex-shrink-0">
              <Lock className="w-6 h-6 md:w-8 md:h-8 text-emerald-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Held SKU Management
              </h1>
              <p className="text-gray-600 text-xs md:text-base mt-1">
                Monitor and manage SKU
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-full md:max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-3 md:left-4 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search account or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-2.5 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-300 transition-colors bg-white text-gray-900 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
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

          <div className="h-1 w-20 rounded-full mt-4 md:mt-6 bg-emerald-700" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 border-l-4 border-red-500 bg-red-50 rounded-lg flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-xs md:text-sm font-medium flex-1 break-words">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-700 text-lg md:text-xl font-bold flex-shrink-0"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Accounts List */}
          <div className="lg:col-span-2">
            <div className="space-y-3 md:space-y-4">
              {accounts.length === 0 ? (
                <div className="p-6 md:p-12 rounded-lg md:rounded-xl border-2 border-dashed border-gray-200 text-center bg-gray-50">
                  <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-600 text-base md:text-lg font-medium">
                    No vendor accounts found
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">
                    Connect your first vendor account to get started
                  </p>
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="p-6 md:p-12 rounded-lg md:rounded-xl border-2 border-dashed border-gray-200 text-center bg-gray-50">
                  <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-600 text-base md:text-lg font-medium">
                    No results found
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">
                    Try searching with a different account name or SKU
                  </p>
                </div>
              ) : (
                filteredAccounts.map((account) => {
                  const skuCount = heldSkus[account.id]?.length || 0
                  const accountSkus = heldSkus[account.id] || []

                  return (
                    <div
                      key={account.id}
                      className="rounded-lg md:rounded-xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                      style={{ animation: 'slideIn 0.4s ease-out' }}
                    >
                      {/* Account Header */}
                      <div className="p-4 md:p-6 flex items-center justify-between border-b-2 border-gray-100 hover:bg-gray-50/50 transition-colors gap-3">
                        <button
                          onClick={() => toggleAccount(account.id)}
                          className="flex items-center gap-3 md:gap-5 flex-1 text-left min-w-0"
                        >
                          <div className="p-2 md:p-4 rounded-lg bg-emerald-700 text-white font-bold text-lg md:text-xl w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                            {account.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base md:text-xl font-bold text-gray-900 truncate">
                              {account.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 md:mt-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-white bg-emerald-700 flex-shrink-0">
                                <Lock className="w-3 h-3 md:w-4 md:h-4" />
                                {skuCount} SKU{skuCount !== 1 ? 's' : ''} Held
                              </span>
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() =>
                              setAddSkuModal({
                                isOpen: true,
                                accountId: account.id,
                                accountName: account.name,
                              })
                            }
                            className="p-2 md:p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-md"
                            title="Add SKU"
                          >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <ChevronDown
                            className={`w-5 h-5 md:w-6 md:h-6 text-gray-400 transition-transform duration-300 ${expandedAccount === account.id ? 'rotate-180' : 'rotate-0'}`}
                          />
                        </div>
                      </div>

                      {/* Held SKUs Section */}
                      {expandedAccount === account.id && (
                        <div className="border-t-2 border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                          {accountSkus && accountSkus.length > 0 ? (
                            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                              <p className="text-gray-700 text-xs font-bold uppercase tracking-wider">
                                Held SKUs
                              </p>
                              <div className="flex flex-wrap gap-2 md:gap-3">
                                {accountSkus.map((sku) => (
                                  <div
                                    key={`${account.id}-${sku}`}
                                    className="flex items-center gap-2"
                                    style={{ animation: 'slideUp 0.3s ease-out' }}
                                  >
                                    <button
                                      onClick={() => fetchSkuDetails(account.id, sku)}
                                      className={`px-3 md:px-4 py-2 md:py-3 border-2 border-emerald-700 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2 hover:shadow-md hover:bg-emerald-700 hover:text-white whitespace-nowrap ${
                                        selectedSku?.sku === sku && selectedSku?.accountId === account.id
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : 'bg-transparent text-emerald-700'
                                      }`}
                                    >
                                      <span className="font-mono text-xs md:text-sm">{sku}</span>
                                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteSku(account.id, sku)}
                                      disabled={deletingSkus.has(`${account.id}-${sku}`)}
                                      className="p-2 md:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <div className="p-6 md:p-8 text-center text-gray-500 py-8 md:py-10">
                              <Package className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 opacity-40" />
                              <p className="text-xs md:text-sm font-medium">
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
            <div className="rounded-lg md:rounded-xl border-2 border-gray-200 p-4 md:p-8 bg-white shadow-sm h-fit sticky top-4 md:top-6">
              <h3 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                SKU Details
              </h3>

              {selectedSku ? (
                <div className="space-y-3 md:space-y-5">
                  {detailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 md:py-12">
                      <Loader className="w-6 h-6 md:w-8 md:h-8 animate-spin text-emerald-700 mb-3 md:mb-4" />
                      <p className="text-gray-600 text-xs md:text-sm font-medium">Loading details...</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg p-3 md:p-5 border-2 border-emerald-200 bg-emerald-50">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">
                          SKU Number
                        </p>
                        <p className="text-xl md:text-2xl font-bold font-mono text-emerald-700 break-all">
                          {selectedSku.sku}
                        </p>
                      </div>

                      {skuDetails[`${selectedSku.accountId}-${selectedSku.sku}`] && (
                        <div className="rounded-lg p-3 md:p-5 space-y-3 md:space-y-4 border-2 border-gray-100 bg-gray-50">
                          {Object.entries(
                            skuDetails[`${selectedSku.accountId}-${selectedSku.sku}`]
                          )
                            .filter(([key]) => key !== 'sku')
                            .map(([key, value]) => (
                              <div key={key} className="text-xs md:text-sm">
                                <p className="text-gray-600 text-xs uppercase tracking-widest font-bold mb-1 md:mb-2">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-gray-900 font-mono break-all bg-white p-2 md:p-3 rounded border border-gray-200 text-xs md:text-sm">
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}

                      <button
                        onClick={() => deleteSku(selectedSku.accountId, selectedSku.sku)}
                        disabled={deletingSkus.has(`${selectedSku.accountId}-${selectedSku.sku}`)}
                        className="w-full mt-4 md:mt-6 px-3 md:px-4 py-2 md:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm md:text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                      >
                        {deletingSkus.has(`${selectedSku.accountId}-${selectedSku.sku}`) ? (
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
                <div className="text-center py-8 md:py-12 text-gray-500">
                  <Package className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-30" />
                  <p className="text-xs md:text-sm font-medium">Select a SKU to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add SKU Modal */}
      <AddSKUModal
        isOpen={addSkuModal.isOpen}
        accountId={addSkuModal.accountId}
        accountName={addSkuModal.accountName}
        onClose={() =>
          setAddSkuModal({ isOpen: false, accountId: null, accountName: null })
        }
        onSkuAdded={() => {
          if (addSkuModal.accountId) {
            fetchHeldSkus(addSkuModal.accountId)
          }
        }}
      />

      {/* Global Animations */}
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default HeldSKU