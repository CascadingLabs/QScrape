<!--
  @qscrape L2 / svelte / eshop / island
  @component EshopProductGrid
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fakeGet } from '../../../../data/api';
  import { getByCategory, getProductBySku, products } from '../../../../data/eshop/products';
  import { addToCart, cartCount, clearCart, getCart, removeFromCart, updateQty } from '../../../../data/eshop/cart';
  import type { CartItem } from '../../../../data/eshop/cart';
  import '../../../../styles/l2/eshop.css';

  const PER_PAGE = 9;

  let ready = false;
  let view: 'grid' | 'detail' | 'cart' | 'checkout' | 'confirm' = 'grid';
  let currentSku: string | null = null;
  let cat: string | null = null;
  let page = 1;
  let cart: CartItem[] = [];
  let orderNum = '';
  let formErrors: string[] = [];
  let checkoutFormEl: HTMLElement | null = null;

  function validateInput(value: string, type: string): string | null {
    const v = value.trim();
    if (!v) { return 'required'; }
    if (type === 'name' && v.length < 2) { return 'at least 2 characters'; }
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return 'invalid email'; }
    if (type === 'postcode' && v.length < 3) { return 'too short'; }
    if (type === 'card' && !/^\d{13,19}$/.test(v.replace(/[\s-]/g, ''))) { return 'must be 13–19 digits'; }
    if (type === 'expiry' && !/^(0[1-9]|1[0-2])[\s/]+\d{2}$/.test(v)) { return 'use MM / YY'; }
    if (type === 'cvv' && !/^\d{3,4}$/.test(v)) { return '3 or 4 digits'; }
    return null;
  }

  function getUrlState() {
    const p = new URLSearchParams(window.location.search);
    return { sku: p.get('sku'), cat: p.get('cat'), view: p.get('view') };
  }

  function goToProduct(sku: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('sku', sku);
    url.searchParams.delete('cat');
    url.searchParams.delete('view');
    history.pushState(null, '', url.toString());
    window.dispatchEvent(new CustomEvent('eshop:product', { detail: sku }));
    window.scrollTo(0, 0);
  }

  function goToView(v: 'cart' | 'checkout') {
    const url = new URL(window.location.href);
    url.searchParams.set('view', v);
    url.searchParams.delete('sku');
    history.pushState(null, '', url.toString());
    window.dispatchEvent(new CustomEvent('eshop:view', { detail: v }));
    window.scrollTo(0, 0);
  }

  $: product = currentSku ? getProductBySku(currentSku) : null;
  $: filtered = cat ? getByCategory(cat) : products;
  $: totalPages = Math.ceil(filtered.length / PER_PAGE);
  $: items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  $: cartTotal = cart.reduce((sum, item) => {
    const p = getProductBySku(item.sku);
    return sum + (p ? (p.salePrice ?? p.basePrice) * item.qty : 0);
  }, 0);
  $: itemCount = cartCount(cart);

  function stars(rating: number) {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  function stockLabel(inStock: boolean, stock?: number) {
    if (!inStock) { return 'Out of Stock'; }
    if (stock && stock <= 5) { return `Only ${stock} left in stock`; }
    return 'In Stock';
  }

  function handleAddToCart() {
    if (currentSku) {
      addToCart(currentSku);
      goToView('cart');
    }
  }

  function handleCheckout() {
    if (checkoutFormEl) {
      const inputs = Array.from(checkoutFormEl.querySelectorAll<HTMLInputElement>('input[data-required]'));
      const msgs: string[] = [];
      for (const el of inputs) {
        const err = validateInput(el.value, el.dataset.validate ?? 'text');
        if (err) { el.style.borderColor = 'var(--vm-sale)'; msgs.push(`${el.dataset.label}: ${err}`); }
        else { el.style.borderColor = 'var(--vm-cta)'; }
      }
      if (msgs.length > 0) { formErrors = msgs; return; }
    }
    formErrors = [];
    orderNum = `VM-312-${Math.floor(100000 + Math.random() * 900000)}`;
    clearCart();
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    history.pushState(null, '', url.toString());
    view = 'confirm';
  }

  function handleDone() {
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    history.pushState(null, '', url.toString());
    view = 'grid';
  }

  function handleRemove(sku: string) { removeFromCart(sku); }
  function handleUpdateQty(sku: string, qty: number) { updateQty(sku, qty); }

  function lineTotalFor(item: CartItem) {
    const p = getProductBySku(item.sku);
    return p ? ((p.salePrice ?? p.basePrice) * item.qty).toFixed(2) : '0.00';
  }

  function unitPriceFor(item: CartItem) {
    const p = getProductBySku(item.sku);
    return p ? (p.salePrice ?? p.basePrice).toFixed(2) : '0.00';
  }

  function onPop() {
    const { sku, cat: c, view: v } = getUrlState();
    if (v === 'cart') { view = 'cart'; }
    else if (v === 'checkout') { view = 'checkout'; }
    else if (sku) { view = 'detail'; currentSku = sku; }
    else { view = 'grid'; cat = c; page = 1; }
  }
  function onCat(e: Event) {
    cat = (e as CustomEvent<string | null>).detail;
    view = 'grid';
    page = 1;
  }
  function onProduct(e: Event) {
    currentSku = (e as CustomEvent<string>).detail;
    view = 'detail';
  }
  function onCartEvent(e: Event) {
    cart = [...(e as CustomEvent<CartItem[]>).detail];
  }
  function onViewEvent(e: Event) {
    view = (e as CustomEvent<typeof view>).detail;
  }

  onMount(() => {
    const { sku, cat: c, view: v } = getUrlState();
    if (v === 'cart') { view = 'cart'; }
    else if (v === 'checkout') { view = 'checkout'; }
    else if (sku) { view = 'detail'; currentSku = sku; }
    cat = c;
    cart = getCart();
    fakeGet(null).then(() => { ready = true; });
    window.addEventListener('popstate', onPop);
    window.addEventListener('eshop:cat', onCat);
    window.addEventListener('eshop:product', onProduct);
    window.addEventListener('eshop:cart', onCartEvent);
    window.addEventListener('eshop:view', onViewEvent);
  });

  onDestroy(() => {
    window.removeEventListener('popstate', onPop);
    window.removeEventListener('eshop:cat', onCat);
    window.removeEventListener('eshop:product', onProduct);
    window.removeEventListener('eshop:cart', onCartEvent);
    window.removeEventListener('eshop:view', onViewEvent);
  });
</script>

{#if !ready}
  <div class="vm-loading">Loading…</div>

<!-- ── Order Confirmation ────────────────────────────── -->
{:else if view === 'confirm'}
  <div data-component="eshop-confirm" class="vm-confirm">
    <div class="vm-confirm-check">✓</div>
    <h2 class="vm-confirm-title">Order Confirmed!</h2>
    <p class="vm-confirm-sub">Thank you for your order. A confirmation has been sent to your inbox.</p>
    <p class="vm-confirm-ref">Order reference: <strong data-order-id={orderNum}>{orderNum}</strong></p>
    <button type="button" class="vm-primary-btn" on:click={handleDone}>Continue Shopping</button>
  </div>

<!-- ── Checkout ────────────────────────────────────── -->
{:else if view === 'checkout'}
  <div data-component="eshop-checkout" class="vm-checkout">
    <button type="button" class="vm-back-btn" on:click={() => goToView('cart')}>← Back to cart</button>
    <h2 class="vm-section-title">Checkout</h2>
    {#if formErrors.length > 0}
      <div role="alert" class="vm-form-errors">
        <strong>Please fix:</strong>
        <ul class="vm-error-list">{#each formErrors as e}<li>{e}</li>{/each}</ul>
      </div>
    {/if}
    <div class="vm-checkout-grid" bind:this={checkoutFormEl}>
      <div>
        <h3 class="vm-form-heading">Shipping Information</h3>
        <div class="vm-form-row-2">
          <div class="vm-field"><label class="vm-label">First name</label><input class="vm-input" type="text" placeholder="Aldric" data-required="true" data-label="First name" data-validate="name" /></div>
          <div class="vm-field"><label class="vm-label">Last name</label><input class="vm-input" type="text" placeholder="Blackwood" data-required="true" data-label="Last name" data-validate="name" /></div>
        </div>
        <div class="vm-field"><label class="vm-label">Email</label><input class="vm-input" type="email" placeholder="aldric@example.com" data-required="true" data-label="Email" data-validate="email" /></div>
        <div class="vm-field"><label class="vm-label">Address</label><input class="vm-input" type="text" placeholder="12 Irongate Lane" data-required="true" data-label="Address" data-validate="address" /></div>
        <div class="vm-form-row-3">
          <div class="vm-field"><label class="vm-label">City</label><input class="vm-input" type="text" placeholder="Stonehaven" data-required="true" data-label="City" data-validate="text" /></div>
          <div class="vm-field"><label class="vm-label">Province</label><input class="vm-input" type="text" placeholder="Valdris" data-required="true" data-label="Province" data-validate="text" /></div>
          <div class="vm-field"><label class="vm-label">Post code</label><input class="vm-input" type="text" placeholder="VD-1401" data-required="true" data-label="Post code" data-validate="postcode" /></div>
        </div>
        <h3 class="vm-form-heading" style="margin-top:20px">Payment</h3>
        <p class="vm-card-hint">Test card: 4111 1111 1111 1111 · any future date · any CVV</p>
        <div class="vm-field"><label class="vm-label">Card number</label><input class="vm-input" type="text" placeholder="4111 1111 1111 1111" data-required="true" data-label="Card number" data-validate="card" /></div>
        <div class="vm-form-row-2">
          <div class="vm-field"><label class="vm-label">Expiry</label><input class="vm-input" type="text" placeholder="MM / YY" data-required="true" data-label="Expiry" data-validate="expiry" /></div>
          <div class="vm-field"><label class="vm-label">CVV</label><input class="vm-input" type="text" placeholder="···" data-required="true" data-label="CVV" data-validate="cvv" /></div>
        </div>
        <button type="button" class="vm-cta-btn" style="margin-top:8px" on:click={handleCheckout}>Place Order</button>
      </div>
      <div class="vm-order-summary">
        <h3 class="vm-summary-title">Order Summary</h3>
        {#each cart as item (item.sku)}
          <div class="vm-summary-row">
            <span class="vm-summary-name">{getProductBySku(item.sku)?.name} <span class="vm-summary-qty">×{item.qty}</span></span>
            <span class="vm-summary-price">{lineTotalFor(item)} GS</span>
          </div>
        {/each}
        <div class="vm-summary-total">
          <span>Total</span>
          <span data-checkout-total={cartTotal.toFixed(2)}>{cartTotal.toFixed(2)} GS</span>
        </div>
      </div>
    </div>
  </div>

<!-- ── Cart ──────────────────────────────────────────── -->
{:else if view === 'cart'}
  <div data-component="eshop-cart" class="vm-cart">
    <button type="button" class="vm-back-btn" on:click={() => { const url = new URL(window.location.href); url.searchParams.delete('view'); url.searchParams.delete('sku'); history.pushState(null, '', url.toString()); view = 'grid'; }}>← Continue shopping</button>
    <h2 class="vm-section-title">Your Cart</h2>
    {#if cart.length === 0}
      <p class="vm-empty-cart">Your cart is empty.</p>
    {:else}
      <div class="vm-cart-list">
        {#each cart as item, idx (item.sku)}
          <div data-sku={item.sku} class="vm-cart-item" class:vm-cart-item-border={idx < cart.length - 1}>
            <img src={getProductBySku(item.sku)?.image} alt={getProductBySku(item.sku)?.name} width="60" height="45" class="vm-cart-thumb" />
            <div class="vm-cart-info">
              <div class="vm-cart-name">{getProductBySku(item.sku)?.name}</div>
              <div class="vm-cart-unit">{unitPriceFor(item)} GS each</div>
            </div>
            <div class="vm-qty-ctrl">
              <button type="button" class="vm-qty-btn" on:click={() => handleUpdateQty(item.sku, item.qty - 1)}>−</button>
              <span data-qty={item.qty} class="vm-qty-val">{item.qty}</span>
              <button type="button" class="vm-qty-btn" on:click={() => handleUpdateQty(item.sku, item.qty + 1)}>+</button>
            </div>
            <div data-line-total={lineTotalFor(item)} class="vm-line-total">{lineTotalFor(item)} GS</div>
            <button type="button" class="vm-remove-btn" on:click={() => handleRemove(item.sku)}>×</button>
          </div>
        {/each}
      </div>
      <div class="vm-totals-box">
        <div class="vm-totals-row"><span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span><span>{cartTotal.toFixed(2)} GS</span></div>
        <div class="vm-totals-row"><span>Shipping</span><span>Free</span></div>
        <div class="vm-totals-final"><span>Total</span><span data-cart-total={cartTotal.toFixed(2)}>{cartTotal.toFixed(2)} GS</span></div>
      </div>
      <button type="button" class="vm-cta-btn vm-cta-wide" on:click={() => goToView('checkout')}>Proceed to Checkout</button>
    {/if}
  </div>

<!-- ── Product detail ─────────────────────────────────── -->
{:else if view === 'detail' && product}
  <div data-component="eshop-product-detail" data-sku={product.sku} class="vm-detail">
    <button type="button" class="vm-back-btn" on:click={() => history.back()}>← Back to catalog</button>
    <div class="vm-detail-grid">
      <div class="vm-detail-img-wrap">
        <img src={product.image} alt={product.name} width="560" height="400" class="vm-detail-img" />
        <div class="vm-card-badges">
          {#if product.isNew}<span class="vm-badge vm-badge-new">NEW</span>{/if}
          {#if product.salePrice}<span class="vm-badge vm-badge-sale">SALE</span>{/if}
          {#if !product.inStock}<span class="vm-badge vm-badge-oos">OUT OF STOCK</span>{/if}
        </div>
      </div>
      <div class="vm-detail-info">
        <div data-category={product.category} class="vm-detail-cat">{product.category}</div>
        <h1 class="vm-detail-name">{product.name}</h1>
        <div class="vm-detail-meta">SKU: <span data-sku={product.sku}>{product.sku}</span>&nbsp;·&nbsp;{stars(product.rating)} ({product.reviewCount} reviews)</div>
        <div class="vm-detail-price-row">
          <span data-price={(product.salePrice ?? product.basePrice).toFixed(2)} class="vm-detail-price" class:vm-detail-price-sale={!!product.salePrice}>
            {(product.salePrice ?? product.basePrice).toFixed(2)} GS
          </span>
          {#if product.salePrice}
            <span data-original-price={product.basePrice.toFixed(2)} class="vm-detail-orig">{product.basePrice.toFixed(2)} GS</span>
          {/if}
        </div>
        <p class="vm-detail-excerpt">{product.excerpt}</p>
        <div data-in-stock={product.inStock ? 'true' : 'false'} class="vm-detail-stock" class:vm-in-stock={product.inStock} class:vm-out-of-stock={!product.inStock}>
          {stockLabel(product.inStock, product.stock)}
        </div>
        {#if product.inStock}
          <button type="button" class="vm-add-btn" on:click={handleAddToCart}>Add to Cart</button>
        {/if}
      </div>
    </div>
  </div>

<!-- ── Grid view ──────────────────────────────────────── -->
{:else}
  <div data-component="eshop-product-grid" data-framework="svelte" class="vm-grid-wrap">
    <div class="vm-grid-meta">
      {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      {#if cat} in &ldquo;{cat}&rdquo;{/if}
    </div>
    <div class="vm-grid">
      {#each items as p (p.sku)}
        <article data-sku={p.sku} data-category={p.category} class="vm-card"
          on:click={() => goToProduct(p.sku)} on:keydown={(e) => e.key === 'Enter' && goToProduct(p.sku)}
          role="button" tabindex="0">
          <div class="vm-card-img-wrap">
            <img src={p.image} alt={p.name} width="280" height="180" loading="lazy" class="vm-card-img" />
            <div class="vm-card-badges">
              {#if p.isNew}<span class="vm-badge vm-badge-new">NEW</span>{/if}
              {#if p.salePrice}<span class="vm-badge vm-badge-sale">SALE</span>{/if}
              {#if !p.inStock}<span class="vm-badge vm-badge-oos">OOS</span>{/if}
            </div>
          </div>
          <div class="vm-card-body">
            <div class="vm-card-cat" data-category={p.category}>{p.category}</div>
            <h3 class="vm-card-name">{p.name}</h3>
            <div class="vm-card-price-row">
              <span data-price={(p.salePrice ?? p.basePrice).toFixed(2)} class="vm-card-price" class:vm-card-price-sale={!!p.salePrice}>
                {(p.salePrice ?? p.basePrice).toFixed(2)} GS
              </span>
              {#if p.salePrice}
                <span data-original-price={p.basePrice.toFixed(2)} class="vm-card-orig">{p.basePrice.toFixed(2)} GS</span>
              {/if}
            </div>
            <div class="vm-card-rating">{stars(p.rating)} ({p.reviewCount})</div>
          </div>
        </article>
      {/each}
    </div>
    {#if totalPages > 1}
      <div class="vm-pagination">
        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as n}
          <button type="button" class="vm-page-btn" class:vm-page-active={n === page} on:click={() => { page = n; }}>{n}</button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .vm-loading { padding: 40px 24px; color: #888; font-family: system-ui; }
  .vm-back-btn { background: none; border: none; color: var(--vm-primary); cursor: pointer; font-family: var(--vm-font); font-size: 13px; padding: 0; margin: 16px 24px 0; display: flex; align-items: center; gap: 4px; }
  .vm-back-btn:hover { text-decoration: underline; }
  .vm-section-title { font-size: 18px; font-weight: 700; color: var(--vm-text); margin: 16px 24px 16px; }
  .vm-cta-btn { background: var(--vm-cta); color: #fff; border: none; border-radius: var(--vm-radius); padding: 13px 24px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: var(--vm-font); }
  .vm-cta-btn:hover { background: var(--vm-cta-hover); }
  .vm-cta-wide { width: calc(100% - 48px); margin: 0 24px; }
  .vm-primary-btn { background: var(--vm-primary); color: #fff; border: none; border-radius: var(--vm-radius); padding: 11px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--vm-font); }

  /* Confirm */
  .vm-confirm { padding: 48px 24px; text-align: center; }
  .vm-confirm-check { font-size: 48px; margin-bottom: 16px; }
  .vm-confirm-title { font-size: 22px; font-weight: 700; color: var(--vm-text); margin-bottom: 8px; }
  .vm-confirm-sub { font-size: 14px; color: var(--vm-muted); margin-bottom: 8px; }
  .vm-confirm-ref { font-size: 13px; color: var(--vm-muted); margin-bottom: 28px; }

  /* Checkout */
  .vm-form-errors { background: #fef2f2; border: 1px solid var(--vm-sale); border-radius: var(--vm-radius); padding: 12px 16px; margin: 0 24px 16px; font-size: 13px; color: var(--vm-sale); }
  .vm-error-list { margin: 4px 0 0 16px; }
  .vm-checkout { padding-bottom: 32px; }
  .vm-checkout-grid { display: grid; grid-template-columns: 1fr 300px; gap: 28px; padding: 0 24px 24px; }
  @media (max-width: 760px) { .vm-checkout-grid { grid-template-columns: 1fr; } }
  .vm-form-heading { font-size: 14px; font-weight: 700; color: var(--vm-text); margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
  .vm-card-hint { font-size: 12px; color: var(--vm-muted); margin-bottom: 14px; }
  .vm-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .vm-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 100px; gap: 12px; }
  .vm-field { margin-bottom: 14px; }
  .vm-label { display: block; font-size: 12px; font-weight: 600; color: var(--vm-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
  .vm-input { width: 100%; padding: 9px 12px; border: 1px solid var(--vm-border); border-radius: var(--vm-radius); font-size: 14px; color: var(--vm-text); background: var(--vm-surface); font-family: var(--vm-font); box-sizing: border-box; }
  .vm-order-summary { background: var(--vm-surface); border: 1px solid var(--vm-border); border-radius: var(--vm-radius); padding: 16px; align-self: start; }
  .vm-summary-title { font-size: 13px; font-weight: 700; color: var(--vm-text); margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
  .vm-summary-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; gap: 8px; }
  .vm-summary-name { color: var(--vm-text); flex: 1; }
  .vm-summary-qty { color: var(--vm-muted); }
  .vm-summary-price { color: var(--vm-text); font-weight: 600; flex-shrink: 0; }
  .vm-summary-total { border-top: 1px solid var(--vm-border); padding-top: 12px; margin-top: 8px; display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; color: var(--vm-text); }

  /* Cart */
  .vm-cart { padding-bottom: 32px; }
  .vm-empty-cart { padding: 0 24px; font-size: 14px; color: var(--vm-muted); }
  .vm-cart-list { border: 1px solid var(--vm-border); border-radius: var(--vm-radius); overflow: hidden; margin: 0 24px 20px; }
  .vm-cart-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--vm-surface); }
  .vm-cart-item-border { border-bottom: 1px solid var(--vm-border); }
  .vm-cart-thumb { width: 60px; height: 45px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
  .vm-cart-info { flex: 1; min-width: 0; }
  .vm-cart-name { font-size: 14px; font-weight: 600; color: var(--vm-text); margin-bottom: 2px; }
  .vm-cart-unit { font-size: 12px; color: var(--vm-muted); }
  .vm-qty-ctrl { display: flex; align-items: center; gap: 6px; }
  .vm-qty-btn { background: none; border: none; cursor: pointer; font-family: var(--vm-font); font-size: 14px; color: var(--vm-primary); padding: 0 6px; }
  .vm-qty-val { min-width: 24px; text-align: center; font-size: 14px; font-weight: 600; color: var(--vm-text); }
  .vm-line-total { font-size: 14px; font-weight: 700; color: var(--vm-text); min-width: 70px; text-align: right; }
  .vm-remove-btn { background: none; border: none; cursor: pointer; color: var(--vm-muted); font-size: 16px; padding: 0 4px; line-height: 1; }
  .vm-totals-box { background: var(--vm-surface); border: 1px solid var(--vm-border); border-radius: var(--vm-radius); padding: 16px; margin: 0 24px 16px; }
  .vm-totals-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--vm-muted); margin-bottom: 8px; }
  .vm-totals-final { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--vm-text); border-top: 1px solid var(--vm-border); padding-top: 12px; }

  /* Detail */
  .vm-detail { padding-bottom: 32px; }
  .vm-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 16px 24px 24px; }
  @media (max-width: 700px) { .vm-detail-grid { grid-template-columns: 1fr; } }
  .vm-detail-img-wrap { position: relative; }
  .vm-detail-img { width: 100%; border-radius: var(--vm-radius); display: block; }
  .vm-card-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 4px; }
  .vm-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; color: #fff; }
  .vm-badge-new { background: var(--vm-primary); }
  .vm-badge-sale { background: var(--vm-sale); }
  .vm-badge-oos { background: #6b7280; }
  .vm-detail-cat { display: inline-block; font-size: 11px; font-weight: 600; color: var(--vm-primary); background: #2563eb18; padding: 3px 8px; border-radius: 3px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
  .vm-detail-name { font-size: 22px; font-weight: 700; color: var(--vm-text); line-height: 1.25; margin-bottom: 8px; }
  .vm-detail-meta { font-size: 12px; color: var(--vm-muted); margin-bottom: 12px; }
  .vm-detail-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; }
  .vm-detail-price { font-size: 26px; font-weight: 700; color: var(--vm-text); }
  .vm-detail-price-sale { color: var(--vm-sale); }
  .vm-detail-orig { font-size: 16px; color: var(--vm-muted); text-decoration: line-through; }
  .vm-detail-excerpt { font-size: 14px; color: var(--vm-muted); line-height: 1.6; margin-bottom: 16px; }
  .vm-detail-stock { font-size: 13px; font-weight: 600; margin-bottom: 16px; }
  .vm-in-stock { color: var(--vm-cta); }
  .vm-out-of-stock { color: var(--vm-sale); }
  .vm-add-btn { background: var(--vm-cta); color: #fff; border: none; border-radius: var(--vm-radius); padding: 11px 24px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: var(--vm-font); width: 100%; }
  .vm-add-btn:hover { background: var(--vm-cta-hover); }

  /* Grid */
  .vm-grid-wrap { padding: 24px; }
  .vm-grid-meta { font-size: 13px; color: var(--vm-muted); margin-bottom: 14px; }
  .vm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
  .vm-card { border: 1px solid var(--vm-border); border-radius: var(--vm-radius); overflow: hidden; background: var(--vm-surface); box-shadow: var(--vm-shadow); cursor: pointer; transition: box-shadow 0.15s; }
  .vm-card:hover { box-shadow: var(--vm-shadow-hover); }
  .vm-card-img-wrap { position: relative; }
  .vm-card-img { width: 100%; height: 160px; object-fit: cover; display: block; }
  .vm-card-body { padding: 12px; }
  .vm-card-cat { font-size: 11px; color: var(--vm-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
  .vm-card-name { font-size: 14px; font-weight: 600; color: var(--vm-text); line-height: 1.3; margin-bottom: 8px; }
  .vm-card-price-row { display: flex; align-items: baseline; gap: 6px; }
  .vm-card-price { font-size: 15px; font-weight: 700; color: var(--vm-text); }
  .vm-card-price-sale { color: var(--vm-sale); }
  .vm-card-orig { font-size: 12px; color: var(--vm-muted); text-decoration: line-through; }
  .vm-card-rating { font-size: 12px; color: var(--vm-muted); margin-top: 4px; }
  .vm-pagination { display: flex; gap: 8px; margin-top: 24px; justify-content: center; }
  .vm-page-btn { padding: 6px 12px; border: 1px solid var(--vm-border); border-radius: var(--vm-radius); background: transparent; color: var(--vm-text); cursor: pointer; font-family: var(--vm-font); font-size: 13px; }
  .vm-page-active { border-color: var(--vm-primary); background: var(--vm-primary); color: #fff; }
</style>
