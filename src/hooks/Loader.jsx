import React from 'react'
import {Card, Skeleton} from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="w-full flex">
    
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-3 w-full rounded-lg"/>
      <Skeleton className="h-3 w-fullrounded-lg"/>
      <Skeleton className="h-3 w-full rounded-lg"/>
      <Skeleton className="h-3 w-fullrounded-lg"/>
      <Skeleton className="h-3 w-full rounded-lg"/>
      <Skeleton className="h-3 w-fullrounded-lg"/>
    </div>
  </div>
  )
}

export default Loader