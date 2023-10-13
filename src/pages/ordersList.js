import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
    IndexTable,
    LegacyCard,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    ChoiceList,
    Badge,
    HorizontalStack,
    Pagination,
    Box,
    Spinner,
    TextField,
  } from '@shopify/polaris';
  import axios from 'axios';
  import {getOrdersApi} from '../endpoints'
  function GetOrders() {
    const [selected, setSelected] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    const {mode, setMode} = useSetIndexFiltersMode();
    const [orderStatus, setOrderStatus] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate ]= useState('');
    const [queryValue, setQueryValue] = useState('');

    const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(ordersData);
    
    const handleOrderStatusChange = useCallback((value) => setOrderStatus(value),[],);
    const handleDateChange = useCallback((value) => setDateFilter(value),[],);
    const handleFiltersQueryChange = useCallback((value) => setQueryValue(value),[],);
    const handleOrderStatusRemove = useCallback(() => setOrderStatus([]),[],);
    const handleDateRemove = useCallback(() => setDateFilter(''),[],);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
      handleDateRemove();
      handleOrderStatusRemove();
      handleQueryValueRemove();
    }, [
      handleOrderStatusRemove,
      handleDateRemove,
      handleQueryValueRemove,
    ]);
    
    const handleStartDateChange = useCallback(
      (newValue) => setStartDate(newValue),
      [],
      );
      
    const handleEndDateChange = useCallback(
      (newValue) => setEndDate(newValue),
      [],
      );
      
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
        
    
    const showData = () => {
      setLoading(true);    
      let filterdata;
      if(selected!== 0 && orderStatus.length === 0 ){
        filterdata = [itemStrings[selected]]
      }
      else if((selected!== 0 || selected === 0)  && orderStatus.length !== 0){
        filterdata = orderStatus
      }
      else{
        filterdata = []
      }
      const postData = {
        type : filterdata, // [""]
        date: dateFilter[0],
        start_date: startDate,
        end_date: endDate,
        keyword: ""
      }
      axios.post( getOrdersApi(currentPage), postData)
      .then( (res) => {
        if(res.status === 200){
          setLoading(false)
          const { orders } = res.data;
          const {last_page, current_page, data } = orders;
          setOrdersData(data);
          setHasPrevious(current_page > 1);
          setHasNext(last_page > current_page);
        }
      })
      .catch(err => console.log(err));
    }

    useEffect( () =>{
      showData();
    },[orderStatus, selected, dateFilter, startDate, endDate, currentPage])
  
    const filters = [
      {
        key: 'orderStatus',
        label: 'Order status',
        filter: (
          <ChoiceList
            title="Order status"
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
            onChange={handleOrderStatusChange}      
            allowMultiple
            />
        ),
        shortcut: true,
      },
      {
        key: 'dateFilter',
        label: 'dateFilter',
        filter: (
          <>
          <ChoiceList
            title="dateFilter"
            titleHidden
            choices={[     
              {label: 'Today', value: 'today'},
              {label: 'Last 7 Days', value: '7d'},
              {label: 'Last 30 Days', value: '30d'},
              {label: 'Last 90 Days', value: '90d'},
              {label: 'Last 12 months', value: '12m'},
              {label: 'Custom', value: 'custom'},
            ]}
            selected={dateFilter}
            onChange={handleDateChange}      
            />
            {
              dateFilter[0] === 'custom' ? 
              <>
                <TextField
                  label="Starting"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  autoComplete="off" 
                />
                <TextField
                  label="Ending"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  autoComplete="off"
                />
              </>
              : <p></p>
            }  
          </>
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
        onRemove: handleOrderStatusRemove,
      });
    }
    if (dateFilter && !isEmpty(dateFilter)) {
      const key = 'dateFilter';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, dateFilter),
        onRemove: handleDateRemove,
      });
    }
  
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };

      
    let rowMarkup = ordersData?.map(
      (
        {id, shopify_order_number, created_at, customer, price, sheets_download_status, quantity_of_sheets, order_status, has_low_dpi},
        index,
      ) => (
        <IndexTable.Row
        
          onClick={ ()=> window.location.href = `/showorderdetails/${id}` }
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


    const promotedBulkActions = [
      {
        content: 'Download All Sheet',
        onAction: () => console.log('Todo: implement bulk edit'),
      },
    ];

    let bulkActions = [
      {
        content: 'Print Queue',
        onAction: () => console.log('Todo: implement bulk add tags'),
      },
      {
        content: 'Printed',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Dispatched',
        onAction: () => console.log('Todo: implement bulk delete'),
      },
      {
        content: 'On Hold',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Cancelled',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Refunded',
        onAction: () => console.log('Todo: implement bulk remove tags'),
      },
      {
        content: 'Ready For Collection',
        onAction: () => console.log('Todo: implement bulk delete'),
      },
    ];

    const filterActions = () => { // 83 + 30
      if(orderStatus.length > 0){
        if(orderStatus.length > 1){
          bulkActions.splice(3, 3);
          return bulkActions;
        }        
        if(orderStatus[0] === 'Ready For Collection' || orderStatus[0] === 'Refunded' ) return [];
        
        const arr = ['Print Queue', 'printed', 'dispatched', 'On Hold', 'cancelled'];
        return bulkActions.slice(arr.indexOf(orderStatus[0]) + 1);

      } else {
        if(selected === 0){
          bulkActions.splice(3, 3);
          return bulkActions;
        }
        if(itemStrings[selected] === 'Pending' || itemStrings[selected] === 'Approved' || itemStrings[selected] === 'Disapproved') return bulkActions;
        if(selected === 4) return bulkActions.slice(2);
      }
    }

    return (
      <>
      <LegacyCard>
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
        itemCount={ordersData.length || 1}
        selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'Order'},
            {title: 'dateFilter'},
            {title: 'Customer'},
            {title: 'Price'},
            {title: 'Sheet Generation Status'},
            {title: 'Qty Of Sheets'},
            {title: 'Sheet Status'},
            {title: 'Has Low Dpi'},
          ]}

          promotedBulkActions={promotedBulkActions}
          bulkActions={
            filterActions()
          }
          >
          {rowMarkup}
        </IndexTable>
      }
      </LegacyCard>
      <Box style={{marginTop:'20px'}}>
        <HorizontalStack align='center'>
        <Pagination
          hasPrevious = {hasPrevious}
          onPrevious={() => {
            setCurrentPage(currentPage-1)
          }}
          hasNext={hasNext}
          onNext={() => {
            setCurrentPage(currentPage + 1)
          }}
          />
        </HorizontalStack>
      </Box>
    </>
    );
  
    function disambiguateLabel(key, value ) {
      switch (key) {
        case 'orderStatus':
          return (value).map((val) => `Customer ${val}`).join(', ');
        case 'dateFilter':
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