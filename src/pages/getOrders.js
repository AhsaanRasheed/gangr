import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
    IndexTable,
    LegacyCard,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    Text,
    ChoiceList,
    Badge,
    Page,
    HorizontalStack,
    Pagination,
    Box,
    Spinner,
    TextField
  } from '@shopify/polaris';
  import axios from 'axios';
  import {getOrdersApi} from '../endpoints'
  function GetOrders() {
    const [selected, setSelected] = useState(0);
    const [Data, setData] = useState("");
    const [num, setnum] = useState();
    const [loading, setLoading] = useState(true)
    
    const [itemStrings, setItemStrings] = useState([
      'All',
      'Pending',
      'Approved',
      'Disapproved',
      'Resubmitted',
    ]);
  
    const tabs = itemStrings.map((item, index) => ({
      content: item,
      index,
      onAction: () => {
      },
      id: `${item}-${index}`,
      isLocked: index === 0, 
    }));
    
    const {mode, setMode} = useSetIndexFiltersMode();
    const [orderStatus, setorderStatus] = useState([]);
    const [Date, setDate] = useState();
    const [queryValue, setQueryValue] = useState('');
    
    const handleorderStatusChange = useCallback((value) => setorderStatus(value),[],);
    const handleDateChange = useCallback((value) => setDate(value),[],);
    const handleFiltersQueryChange = useCallback((value) => setQueryValue(value),[],);
    const handleorderStatusRemove = useCallback(() => setorderStatus([]),[],);
    const handleDateRemove = useCallback(() => setDate(),[],);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
      handleDateRemove();
      handleorderStatusRemove();
      handleQueryValueRemove();
    }, [
      handleorderStatusRemove,
      handleDateRemove,
      handleQueryValueRemove,
    ]);
  
    const showData = async ()=>{
      setLoading(true);
      
      let filterdata;
      
      if(selected!== 0 ){
        filterdata = selected === 0 ? [] : [itemStrings[selected]]
      }
      else if(orderStatus.length !== 0){
        filterdata = orderStatus
      }
      else{
        filterdata = []
      }

      console.log(Date)
      console.log(selected)
      let dateFilter= Date[0]
      console.log(dateFilter)
      const postData = {

        type : filterdata,
        date: Date[0],
        start_date: "",
        end_date: "",
        keyword: ""
      }
      
      axios.post( getOrdersApi, postData)
      .then(async (response) => {
        setData(response.data)
        console.log(response.data);
        setLoading(false)
      })
      .catch(err => console.log(err));
    }

    useEffect( () =>{
      showData();
    },[orderStatus, selected, Date])
  
    const filters = [
      {
        key: 'orderStatus',
        label: 'Order status',
        filter: (
          <ChoiceList
            title="Account status"
            titleHidden
            choices={[
              {label: 'Pending', value: 'pending'},
              {label: 'Print Queue', value: 'Print Queue'},
              {label: 'Printed', value: 'printed'},
              {label: 'Dispatched', value: 'dispatched'},
              {label: 'On-Hold', value: 'On Hold'},
              {label: 'Cancelled', value: 'cancelled'},
              {label: 'Refunded', value: 'Refunded'},
              {label: 'Ready For Collection', value: 'Ready For Collection'},
            ]}
            selected={orderStatus || []}
            onChange={handleorderStatusChange}      
            allowMultiple
          />
        ),
        shortcut: true,
      },
      {
        key: 'Date',
        label: 'Date',
        filter: (
          <ChoiceList
            title="Date"
            titleHidden
            choices={[
               
              {label: 'Today', value: 'today'},
              {label: 'Last 7 Days', value: '7d'},
              {label: 'Last 30 Days', value: '30d'},
              {label: 'Last 90 Days', value: '90d'},
              {label: 'Last 12 months', value: '12m'},
              {label: 'Custom', value: 'custom'},
            ]}
            selected={Date || ''}
            onChange={handleDateChange}      
          />
        ),
        shortcut: true,
      },      
    ];
    const appliedFilters = [];
    if (orderStatus && !isEmpty(orderStatus)) {
      const key = 'orderStatus';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, orderStatus),
        onRemove: handleorderStatusRemove,
      });
    }
    if (Date && !isEmpty(Date)) {
      const key = 'Date';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, Date),
        onRemove: handleDateRemove,
      });
    }
  
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };
  
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(Data?.orders?.data);
      
  
    let rowMarkup = Data?.orders?.data?.map(
      (
        {id, shopify_order_number, created_at, customer, price, sheets_download_status, quantity_of_sheets, order_status, has_low_dpi},
        index,
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}  
        >
          <IndexTable.Cell>{shopify_order_number}</IndexTable.Cell>
          <IndexTable.Cell>{created_at}</IndexTable.Cell>
          <IndexTable.Cell>{customer?.name}</IndexTable.Cell>
          <IndexTable.Cell>{price}</IndexTable.Cell>
          <IndexTable.Cell>{

            sheets_download_status === 'Ready For Download' ? 
            <Badge status='success'> { sheets_download_status } </Badge> :
            <Badge status="Attention">{ sheets_download_status } </Badge>

          }
          </IndexTable.Cell>
          <IndexTable.Cell>{quantity_of_sheets}</IndexTable.Cell>
          <IndexTable.Cell>{order_status}</IndexTable.Cell>
          <IndexTable.Cell>{
            has_low_dpi === 0 ? 
            <Badge status='success'> No </Badge> :
            <Badge status="critical">Yes </Badge>
            }
          </IndexTable.Cell>
      
        </IndexTable.Row>
      ),
    );
    return (
      <>
        
      {/* <LegacyCard>
        <IndexFilters
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => {}}
          
          cancelAction={{
            onAction: handleFiltersClearAll,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={
            setSelected
          }
          canCreateNewView={false}
          
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
          />
        {loading ? 
        <HorizontalStack align='center'>
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </HorizontalStack> 
        :
        <IndexTable
        resourceName={resourceName}
        itemCount={Data.orders?.data?.length || 1}
        selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'Order'},
            {title: 'Date'},
            {title: 'Customer'},
            {title: 'Price'},
            {title: 'Sheet Generation Status'},
            {title: 'Qty Of Sheets'},
            {title: 'Sheet Status'},
            {title: 'Has Low Dpi'},
          ]}
          >
          {rowMarkup}
        </IndexTable>
      }
      </LegacyCard>
      <Box style={{marginTop:'20px'}}>
        <HorizontalStack align='center'>
        <Pagination
          hasPrevious = {Data?.data?.current_page > 1}
          onPrevious={() => {
            Data?.data?.current_page > 1 && 
            setnum(Data?.data?.current_page-1)
          }}
          hasNext={Data?.data?.last_page > Data?.data?.current_page}
          onNext={() => {
            Data?.data?.last_page > Data?.data?.current_page && 
            setnum(Data?.data?.current_page+1) 
          }}
          />
        </HorizontalStack>
      </Box> */}
      <TextField
      label="Quantity"
      type="date"
      value={Date}
      onChange={Data}
      autoComplete="off"
    />
    </>
    );
  
    function disambiguateLabel(key, value ) {
      switch (key) {
        case 'orderStatus':
          return (value).map((val) => `Customer ${val}`).join(', ');
        case 'Date':
          return (value).map((val) => `Customer ${val}`).join(', ');  
        default:
          return value ;
      }
    }
  
    function isEmpty(value) {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return value === '' || value == null;
      }
    }
  }
  export default GetOrders;