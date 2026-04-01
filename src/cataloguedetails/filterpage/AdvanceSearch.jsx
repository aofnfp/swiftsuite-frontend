import React from 'react'
import Lipsey from './Lipsey'
import Fragrancex from './Fragrancex'
import Cwr from './Cwr'
import Ssi from './Ssi'
import Zanders from './Zanders'
import Rsr from './Rsr'

const AdvanceSearch = ({ formFilters, handleFormInputChange, handleSubmit, endpoint, productChange, token, page, clearFilters, userId, filterLoading, selectedProductPerPage }) => {
  return (
    <div>
      {productChange === 'lipsey' && <Lipsey formFilters={formFilters} handleFormInputChange={handleFormInputChange} handleSubmit={handleSubmit} clearFilters={clearFilters} filterLoading={filterLoading} />}
      {productChange === 'fragrancex' && <Fragrancex formFilters={formFilters} handleFormInputChange={handleFormInputChange} handleSubmit={handleSubmit} clearFilters={clearFilters} filterLoading={filterLoading} />}
      {productChange === 'cwr' && <Cwr formFilters={formFilters} handleFormInputChange={handleFormInputChange} handleSubmit={handleSubmit} clearFilters={clearFilters} filterLoading={filterLoading} />}
      {productChange === 'ssi' && <Ssi formFilters={formFilters} handleFormInputChange={handleFormInputChange} handleSubmit={handleSubmit} clearFilters={clearFilters} filterLoading={filterLoading} />}
      {productChange === 'zanders' && <Zanders formFilters={formFilters} handleFormInputChange={handleFormInputChange} handleSubmit={handleSubmit} clearFilters={clearFilters} filterLoading={filterLoading} />}
      {productChange === 'rsr' && <Rsr formFilters={formFilters} handleFormInputChange={handleFormInputChange} handleSubmit={handleSubmit} clearFilters={clearFilters} filterLoading={filterLoading} />}
    </div>
  )
}

export default AdvanceSearch;