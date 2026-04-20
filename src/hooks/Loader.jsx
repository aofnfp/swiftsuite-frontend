import React from 'react'
import { Skeleton } from 'antd';

const Loader = () => {
  return (
    <div className="w-full flex">
    <Skeleton className="h-10 w-full rounded-lg" active={true} paragraph={{ rows: 10 }}/>
  </div>
  )
}

export default Loader