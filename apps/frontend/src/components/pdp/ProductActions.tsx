'use client';

import { useState, MouseEvent } from 'react';
import { Minus, Plus, ShoppingBag, Zap } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

type Product = any;
type Variant = any;

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e?: MouseEvent<HTMLButtonElement>) => {
    if (product.stock === 0) return;
    setIsAdding(true);
    
    // Create flying image animation
    if (e) {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const flyImg = document.createElement('img');
      flyImg.src = product.images[0];
      flyImg.style.position = 'fixed';
    flyImg.style.top = `${rect.top}px`;
    flyImg.style.left = `${rect.left + rect.width / 2}px`;
    flyImg.style.width = '40px';
    flyImg.style.height = '40px';
    flyImg.style.objectFit = 'cover';
    flyImg.style.borderRadius = '50%';
    flyImg.style.zIndex = '9999';
    flyImg.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    document.body.appendChild(flyImg);
    
    // Next frame
    setTimeout(() => {
      flyImg.style.top = '20px';
      flyImg.style.left = 'calc(100vw - 60px)'; // approximate cart icon location
      flyImg.style.transform = 'scale(0.1)';
      flyImg.style.opacity = '0';
    }, 50);
    
      setTimeout(() => document.body.removeChild(flyImg), 650);
    }

    // simulate network
    await new Promise(r => setTimeout(r, 600));
    addItem({
      id: selectedVariant?.id ? `${product.id}-${selectedVariant.id}` : product.id,
      name: product.name['en'] || product.name,
      price: product.price_paise,
      image: product.images[0],
      qty: quantity
    });
    setIsAdding(false);
    toast.success('Added to Cart');
  };

  const handleBuyNow = async () => {
    if (product.stock === 0) return;
    await handleAddToCart();
    window.location.href = '/checkout';
  };

  const isOutOfStock = product.stock === 0 || (selectedVariant && selectedVariant.stock === 0);

  return (
    <div className="space-y-6">
      
      {/* Variants (Sizes/Colors mapped from attributes) */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-navy-900">Select Option</span>
            {selectedVariant?.attributes?.size && <span className="text-xs text-primary-600 font-semibold cursor-pointer">Size Guide</span>}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v: Variant) => {
              const label = Object.values(v.attributes || {}).join(' / ') || v.sku;
              const vStock = v.stock;
              const isSelected = selectedVariant?.id === v.id;
              
              return (
                <button
                  key={v.id}
                  disabled={vStock === 0}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    vStock === 0 
                      ? 'border-border text-muted bg-surface-alt line-through cursor-not-allowed opacity-50' 
                      : isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                        : 'border-border text-navy-700 hover:border-navy-300 bg-surface'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        {/* Qty */}
        <div className="flex items-center justify-between bg-surface-alt border border-border rounded-2xl p-1.5 w-full sm:w-auto overflow-hidden">
          <button 
            disabled={quantity <= 1 || isOutOfStock}
            onClick={() => setQuantity(q => q - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-navy-600 disabled:opacity-50 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-bold text-navy-900">{quantity}</span>
          <button 
            disabled={quantity >= (selectedVariant?.stock || product.stock) || isOutOfStock}
            onClick={() => setQuantity(q => q + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-navy-600 disabled:opacity-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="flex-1 btn-secondary !py-3.5 !rounded-2xl !text-base disabled:bg-surface-alt disabled:text-muted disabled:border-border"
          >
            <ShoppingBag size={18} className={isAdding ? 'animate-bounce' : ''} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
          
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 btn-primary !py-3.5 !rounded-2xl !text-base shadow-glow-saffron disabled:opacity-50"
          >
            <Zap size={18} className="fill-white" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
