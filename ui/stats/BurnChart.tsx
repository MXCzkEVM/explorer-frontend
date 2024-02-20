import React, { useEffect, useState, useRef } from "react"
import {mxczkevmClient} from "constants/graphClient"
import {getMXCBurn} from 'constants/graphql/mxczkevm'
import ChartWidget from '../shared/chart/ChartWidget';

export default function BurnChart() {
  const [isLoading, setLoading] = useState(false)
  const [burns, setBurns] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await mxczkevmClient.query({
        query: getMXCBurn(),
      })
      let burns = result?.data?.mxcdayDatas || []
      
      burns = burns.map((item:any) => {
        return { date: new Date(item.date*1000), value: Number(item.burn) }
      })
      setBurns(burns)
      setLoading(false)
    }
    fetchData()
  }, [])
  


  return (
    <div className="burnChart">
      <ChartWidget
        isError={ false }
        items={ burns }
        title={ "Daily MXC Burn" }
        units={ 'MXC' }
        description={ "Daily MXC burnt amounts " }
        isLoading={ isLoading }
        minH="230px"
      />
    </div>
  );
};

