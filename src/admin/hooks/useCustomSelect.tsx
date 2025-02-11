import { useState, useCallback } from "react"

export type SelectOption = {
  value: string
  label: string
}

export const useCustomSelect = (options: SelectOption[], product_id: string, onSelectChange?: Function) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>()
  console.log('options',onSelectChange)

  const handleValueChange = useCallback( (value: string) => {
    setSelectedValue(value)
    onSelectChange && onSelectChange({ author_id:value, product_id:product_id})
    
//    console.log('valuewwww',value,product_id)
  }, [onSelectChange])

  return {
    selectedValue,
    handleValueChange,
    options
  }
}