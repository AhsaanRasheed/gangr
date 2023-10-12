import React from 'react'
import {Page, LegacyCard, Box, HorizontalStack, Grid, Card, Thumbnail, Popover, ActionList, Button, Badge} from '@shopify/polaris';
import {ArrowDownMinor} from '@shopify/polaris-icons';
import axios from 'axios';
import {getOrderDetailApi, getOrdersApi} from '../endpoints';
import { useState , useEffect, useCallback} from 'react';
import { useParams } from 'react-router-dom';
export default function ShowOrderDetails() {


    const [Data, setData] = useState("");
    const [loading, setLoading] = useState(true)
    const id = useParams();

    const showData = ()=>{
        
        console.log(id)
        setLoading(true);

        axios.post( getOrderDetailApi(id.id))
        .then( (response) => {
          setData(response.data)
          console.log(response);
          setLoading(false)
        })
        .catch(err => console.log(getOrdersApi));
    }

    useEffect(() =>{
        showData();
    },[])


    let ShowOrders = Data?.order?.line_items?.map(({name, price, quantity, file, sku}, index) => (
            <>
            <Card>
                <HorizontalStack align='space-around'>
                    
                    <Box>
                        <p style={{fontWeight: 'bold'}}>Product</p>
                        <br />

                        <Box>
                            <HorizontalStack align=''>
                                <Thumbnail
                                    source={file}
                                    size="large"
                                    alt="Black choker necklace"
                                />
                                
                                <Box>
                                    <p>{name}</p>
                                    <p>SKU: {sku}</p>
                                </Box>
                            </HorizontalStack>
                        </Box>
                    </Box>
                    <Box>
                        <p style={{fontWeight: 'bold'}}>Quantity</p>
                        <p >{quantity}</p>
                    </Box>
                    <Box>
                        <p style={{fontWeight: 'bold'}}>Total</p>
                        <p>{price}</p>
                    </Box>
                </HorizontalStack>
             </Card>
             <br />
            </>
        )
    );

    const [active, setActive] = useState(true);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
  
    const handleImportedAction = useCallback(
      () => console.log('Imported action'),
      [],
    );
  
    const handleExportedAction = useCallback(
      () => console.log('Exported action'),
      [],
    );
  
    const activator = (
      <Button onClick={toggleActive} disclosure>
        Update Status
      </Button>
    );

    return (
        <Page
        backAction={{content: 'Products', url: '/'}}
        title= {
            `#${Data?.order?.shopify_order_number} 
            ${<Badge 
                tone="success"
                progress="complete">    
            { Data?.order?.order_type } </Badge>
            }`
        }
        subtitle={`${Data?.order?.created_at}`}
        secondaryActions={
        
        <Popover
          active={active}
          activator={activator}
          autofocusTarget="first-node"
          onClose={toggleActive}
        >
          <ActionList
            actionRole="menuitem"
            items={[
              {
                content: 'Print Queue',
                onAction: handleImportedAction,
              },
              {
                content: 'Printed',
                onAction: handleExportedAction,
              },
              {
                content: 'Dispatched',
                onAction: handleExportedAction,
              },
              {
                content: 'On Hold',
                onAction: handleExportedAction,
              },
              {
                content: 'Cancelled',
                onAction: handleExportedAction,
              },
              {
                content: 'Refunded',
                onAction: handleExportedAction,
              },
              {
                content: 'Ready For Collection',
                onAction: handleExportedAction,
              },
            ]}
          />
        </Popover>
      
      }
      >
        <Page fullWidth>
        <Grid>
            
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
             {ShowOrders}
            </Grid.Cell>

            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <LegacyCard title="Orders" sectioned>
                <p>View a summary of your online store’s orders.</p>
            </LegacyCard>
            </Grid.Cell>

        </Grid>
        </Page>
      </Page>
    )
  
}

