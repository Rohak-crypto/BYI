const categories = [
  {name:"Electronics", count:"1,250+", icon:"▣", image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Premium Laptop","₹45,000","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",2*3600+35*60],
    ["Premium Smartphone","₹28,500","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",4*3600+10*60],
    ["Mirrorless Camera","₹52,000","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",1*3600+50*60]
   ]},
  {name:"Furniture", count:"980+", icon:"▤", image:"https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Luxury Green Sofa","₹18,000","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",1*3600+45*60],
    ["Modern Dining Set","₹24,500","https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",3*3600+20*60],
    ["Classic Wooden Chair","₹8,500","https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85",2*3600+12*60],
    ["King Size Bed","₹32,000","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",5*3600+5*60]
   ]},
  {name:"Jewellery", count:"760+", icon:"♢", image:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Diamond Necklace","₹85,000","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",2*3600+15*60],
    ["Gold Ring","₹42,000","https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",1*3600+25*60],
    ["Pearl Bracelet","₹22,500","https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",4*3600+30*60]
   ]},
  {name:"Art & Collectibles", count:"540+", icon:"▣", image:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Antique Landscape Painting","₹65,000","https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",3*3600+10*60],
    ["Vintage Sculpture","₹38,000","https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",2*3600+40*60],
    ["Rare Collectible Coin","₹18,500","https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=85",6*3600+15*60]
   ]},
  {name:"Vehicles", count:"320+", icon:"▱", image:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Classic Vintage Car","₹8,50,000","https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=85",8*3600+10*60],
    ["Premium Sports Car","₹22,00,000","https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",4*3600+50*60]
   ]},
  {name:"Fashion", count:"1,100+", icon:"♧", image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Designer Handbag","₹32,000","https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",2*3600+35*60],
    ["Luxury Sunglasses","₹14,500","https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",1*3600+5*60],
    ["Designer Dress","₹28,000","https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",5*3600+40*60]
   ]},
  {name:"Home & Living", count:"890+", icon:"⌂", image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Modern Lounge Set","₹42,000","https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",2*3600+50*60],
    ["Designer Table Lamp","₹9,500","https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",3*3600+15*60]
   ]},
  {name:"Sports & Hobbies", count:"460+", icon:"◉", image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
   items:[
    ["Professional Tennis Racket","₹12,000","https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=85",1*3600+55*60],
    ["Premium Basketball","₹7,500","https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85",2*3600+25*60]
   ]}
];

const categoryList = document.getElementById("categoryList");
const categoryCards = document.getElementById("categoryCards");
const itemsSection = document.getElementById("itemsSection");
const itemsGrid = document.getElementById("itemsGrid");
const sectionTitle = document.getElementById("sectionTitle");
const itemsTitle = document.getElementById("itemsTitle");
const categorySearch = document.getElementById("categorySearch");
const topSearch = document.getElementById("topSearch");
let selectedCategory = null;
const timers = new Map();

function renderSidebar(filter=""){
  categoryList.innerHTML = "";
  const all = document.createElement("div");
  all.className = "category-item " + (!selectedCategory ? "active" : "");
  all.innerHTML = `<span class="icon">▦</span> All Categories`;
  all.onclick = () => showAll();
  categoryList.appendChild(all);

  categories.filter(c=>c.name.toLowerCase().includes(filter.toLowerCase())).forEach(c=>{
    const el = document.createElement("div");
    el.className = "category-item " + (selectedCategory===c.name ? "active" : "");
    el.innerHTML = `<span class="icon">${c.icon}</span> ${c.name}`;
    el.onclick = () => showCategory(c.name);
    categoryList.appendChild(el);
  });
}

function renderCategories(){
  categoryCards.innerHTML = categories.map(c=>`
    <article class="category-card" data-category="${c.name}">
      <img src="${c.image}" alt="${c.name}">
      <div class="card-info">
        <h3>${c.name}</h3>
        <p>${c.count} items</p>
        <button class="arrow" aria-label="Open ${c.name}">→</button>
      </div>
    </article>`).join("");

  document.querySelectorAll(".category-card").forEach(card=>{
    card.onclick=()=>showCategory(card.dataset.category);
  });
}

function showAll(){
  selectedCategory=null;
  sectionTitle.textContent="All Categories";
  categoryCards.classList.remove("hidden");
  itemsSection.classList.add("hidden");
  renderSidebar(categorySearch.value);
  window.scrollTo({top:document.querySelector(".categories-wrap").offsetTop-10,behavior:"smooth"});
}

function showCategory(name){
  const category=categories.find(c=>c.name===name);
  if(!category) return;
  selectedCategory=name;
  sectionTitle.textContent=name;
  categoryCards.classList.add("hidden");
  itemsSection.classList.remove("hidden");
  itemsTitle.textContent=`${name} Items`;
  renderSidebar(categorySearch.value);
  renderItems(category);
  setTimeout(()=>itemsSection.scrollIntoView({behavior:"smooth",block:"start"}),50);
}

function renderItems(category){
  itemsGrid.innerHTML=category.items.map((item,index)=>`
    <article class="item-card">
      <img src="${item[2]}" alt="${item[0]}">
      <div class="item-body">
        <h3>${item[0]}</h3>
        <span class="price-label">Current Auction Price</span>
        <div class="price" id="price-${category.name}-${index}">${item[1]}</div>
        <div class="timer" id="timer-${category.name}-${index}">Loading...</div>
        <button class="bid-btn" data-category="${category.name}" data-index="${index}">Bid Now</button>
      </div>
    </article>`).join("");

  category.items.forEach((item,index)=>{
    const key=`${category.name}-${index}`;
    if(!timers.has(key)) timers.set(key,{end:Date.now()+item[3]*1000});
    updateTimer(category,index);
  });

  document.querySelectorAll(".bid-btn").forEach(btn=>{
    btn.onclick=()=>openBid(category,Number(btn.dataset.index));
  });
}

function updateTimer(category,index){
  const key=`${category.name}-${index}`;
  const state=timers.get(key);
  const el=document.getElementById(`timer-${category.name}-${index}`);
  const btn=document.querySelector(`.bid-btn[data-category="${CSS.escape(category.name)}"][data-index="${index}"]`);
  if(!el || !state) return;
  const left=Math.max(0,state.end-Date.now());
  if(left<=0){
    el.textContent="Auction Closed";
    if(btn){btn.disabled=true;btn.textContent="Auction Closed";}
    return;
  }
  const total=Math.floor(left/1000);
  const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
  el.textContent=`⏱ ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")} remaining`;
}

setInterval(()=>{
  if(!selectedCategory) return;
  const c=categories.find(x=>x.name===selectedCategory);
  c.items.forEach((_,i)=>updateTimer(c,i));
},1000);

const modal=document.getElementById("bidModal");
const modalItem=document.getElementById("modalItem");
const modalCurrent=document.getElementById("modalCurrent");
const bidAmount=document.getElementById("bidAmount");
const bidMessage=document.getElementById("bidMessage");
let currentBidTarget=null;

function openBid(category,index){
  const item=category.items[index];
  currentBidTarget={category,index};
  modalItem.textContent=item[0];
  modalCurrent.textContent=item[1];
  bidAmount.value="";
  bidAmount.placeholder=`Enter more than ${item[1]}`;
  bidMessage.textContent="";
  modal.classList.remove("hidden");
}
function closeBid(){modal.classList.add("hidden")}
document.getElementById("closeModal").onclick=closeBid;
modal.onclick=e=>{if(e.target===modal)closeBid()};

document.getElementById("confirmBid").onclick=()=>{
  if(!currentBidTarget) return;
  const {category,index}=currentBidTarget;
  const item=category.items[index];
  const current=parseInt(item[1].replace(/[₹,]/g,""),10);
  const amount=parseInt(bidAmount.value,10);
  if(!amount || amount<=current){
    bidMessage.textContent=`Please enter a bid higher than ${item[1]}.`;
    return;
  }
  item[1]=`₹${amount.toLocaleString("en-IN")}`;
  renderItems(category);
  bidMessage.textContent="Bid placed successfully!";
  setTimeout(closeBid,700);
};

categorySearch.addEventListener("input",e=>renderSidebar(e.target.value));
topSearch.addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  if(!q) return;
  const match=categories.find(c=>c.name.toLowerCase().includes(q));
  if(match) showCategory(match.name);
});
document.getElementById("exploreAll").onclick=showAll;
document.getElementById("backCategories").onclick=showAll;

renderSidebar();
renderCategories();
