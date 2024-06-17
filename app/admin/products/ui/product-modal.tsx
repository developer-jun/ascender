import React, { useCallback, useEffect, useRef, useState } from 'react';
import './product-modal.scss';
import { usePageContext, usePageDispatch } from '@/admin/contexts/productList';
import ProductDetails from './product-details';
import Modal from '@/components/modal';
import { Product } from '@/types/product';

const ProductModal = () => {
  const { selectedItem: item } = usePageContext();
  const pageDispatch = usePageDispatch();
  
  const handleOnClose = useCallback(() => {
    pageDispatch({
      type: 'set_fields',
      payload: {
        selectedItem: null
      }
    });
  }, []);

  const handleConfirm = useCallback(() => {
    console.log('Confirm');
    
  }, []);

  const handleCancel = useCallback(() => {
    console.log('Cancel');
    pageDispatch({
      type: 'set_fields',
      payload: {
        selectedItem: null
      }
    });
  }, []);

  return (
    <>
      <Modal
        header={<Modal.Header title="Product Details" onClose={handleOnClose} />}
        footer={<Modal.Footer onConfirm={handleConfirm} onCancel={handleCancel} />}>
        <div className="items-center text-left px-4">
          {item && (
            <div className="prod-name-desc w-full mb-4 scrollable-content">
              <input type="hidden" value={item.id} />
              <div className="field-row">
                <span className="center-image"><img
                  className="object-cover inline-block"
                  src={item.imageUrl ? item.imageUrl : "https://placehold.co/400x300"}
                  alt="Product title"
                  width="250"
                  height="200"
                /></span>
              </div>              
              <hr />
              <div className="field-row">
                <label className="label">Product Name:</label>
                <span className="info">{item.name}</span>
              </div>            
              <div className="field-row">
                <label className="label">URL Slug:</label>                
                <span className="info">{item.slug}</span>
              </div>
              <div className="field-row">
                <label className="label">Category:</label>
                <span className="info">{item.category}</span>                             
              </div>    
              <div className="field-row">
                <label className="label">Summary:</label>
                <span className="info">{item.summary}</span>
              </div>              
                      
              <div className="field-row">
                <label className="label">Price:</label>
                <span className="info">${item.price}</span>
              </div>
              <div className="field-row">
                <label className="label">SKU:</label>
                <span className="info">{item.sku}</span>
              </div>
              <div className="field-row">
                <label className="label">Description:</label>
                <span className="info">{item.description}</span>
              </div>                  
              <div className="field-row">
                <label className="label">Inventory Status:</label>
                <span className="info">{item.inStock}</span>
              </div>     
              <div className="field-row">
                <label className="label">Published:</label>
                <span className="info">{item.published?'Yes':'No'}</span>
              </div>
              
            </div>                
          )}        
        </div>  
      </Modal>
    </>
  );
}

export default ProductModal;