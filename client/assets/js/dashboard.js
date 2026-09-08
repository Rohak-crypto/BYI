const auctions = [
  {id:1,name:"Luxury Wrist Watch",cat:"Fashion",current:42000,your:40000,time:"02:15:30",status:"leading",img:"/home/user/BYI/client/assets/images/watch.jpg",desc:"Premium luxury wrist watch with a classic stainless-steel finish."},
  {id:2,name:"Vintage Camera",cat:"Electronics",current:21000,your:20000,time:"01:40:12",status:"outbid",img:"/home/user/BYI/client/assets/images/camera.jpg",desc:"Classic vintage camera in excellent collectible condition."},
  {id:3,name:"Antique Wooden Chair",cat:"Furniture",current:12800,your:12800,time:"03:20:45",status:"leading",img:"/home/user/BYI/client/assets/images/chair.jpg",desc:"Beautiful handcrafted antique wooden chair with timeless detailing."},
  {id:4,name:"Diamond Necklace",cat:"Jewellery",current:73000,your:70000,time:"00:50:10",status:"outbid",img:"/home/user/BYI/client/assets/images/necklace.jpg",desc:"Elegant diamond necklace presented in a premium jewellery case."},
  {id:5,name:"Classic Painting",cat:"Art & Collectibles",current:60000,your:60000,time:"2h left",status:"leading",img:"/home/user/BYI/client/assets/images/painting.jpg",desc:"A decorative classic painting suitable for collectors and art lovers."},
  {id:6,name:"Vintage Car Model",cat:"Collectibles",current:28500,your:25000,time:"5h left",status:"outbid",img:"/home/user/BYI/client/assets/images/car.jpg",desc:"Detailed vintage automobile collectible model."},
  {id:7,name:"Leather Handbag",cat:"Fashion",current:18000,your:15000,time:"1h left",status:"leading",img:"/home/user/BYI/client/assets/images/handbag.jpg",desc:"Premium leather handbag with a timeless everyday design."},
  {id:8,name:"Gramophone",cat:"Electronics",current:32000,your:28000,time:"4h left",status:"leading",img:"/home/user/BYI/client/assets/images/gramophone.jpg",desc:"Classic gramophone collectible with vintage character."}
];

let wishlist = new Set([5,6,7,8]);
let currentFilter = "all";
let profile = {name:"user",email:"user@example.com",phone:"+91 98765 43210",location:"Hyderabad, India",address:"Madhapur, Hyderabad"};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const on = (selector,event,handler) => { const el = typeof selector === "string" ? $(selector) : selector; if(el) el.addEventListener(event,handler); };

function toast(msg){
  const t = $("#toast"); if(!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(window.bidnestToast); window.bidnestToast = setTimeout(()=>t.classList.remove("show"),2200);
}
function openModal(html){ const c=$("#modalContent"), b=$("#modalBackdrop"); if(c&&b){c.innerHTML=html;b.classList.add("show");} }
function closeModal(){ const b=$("#modalBackdrop"); if(b)b.classList.remove("show"); }

function showSection(id){
  const page=$("#"+id); if(!page) return;
  $$(".page").forEach(p=>p.classList.remove("active-page")); page.classList.add("active-page");
  $$(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  $$(".top-nav button").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  const dd=$("#profileDropdown"); if(dd)dd.classList.remove("show");
  window.scrollTo({top:0,behavior:"smooth"});
}

function updateProfileUI(){
  const map={"#profileName":profile.name,"#profileEmail":profile.email,"#profilePhone":profile.phone,"#profileLocation":profile.location,"#profileAddress":profile.address};
  Object.entries(map).forEach(([id,val])=>{const el=$(id);if(el)el.textContent=val;});
  const first=(profile.name.trim()[0]||"R").toUpperCase();
  const nameEl=$(".profile-name"); if(nameEl)nameEl.textContent="Hi, "+profile.name.split(" ")[0];
  $$(".avatar,#bigAvatar").forEach(el=>el.textContent=first);
}
function updateCounts(){
  const a=$("#savedStat"),b=$("#overviewWish"); if(a)a.textContent=wishlist.size;if(b)b.textContent=wishlist.size;
}

function toggleWish(id){
  wishlist.has(id) ? (wishlist.delete(id),toast("Removed from Watching")) : (wishlist.add(id),toast("Added to Watching"));
  renderAll();
}

function auctionCard(a){
  const saved=wishlist.has(a.id);
  return `<article class="auction-card">
    <img class="auction-img" src="${a.img}" alt="${a.name}" onerror="this.style.background='#3b1d0e';this.src='';">
    <button class="heart ${saved?"saved":""}" data-heart="${a.id}" title="Watching">${saved?"♥":"♡"}</button>
    <div class="auction-body"><h3>${a.name}</h3><p>${a.cat}</p>
      <div class="price-row"><span>Current bid</span><strong>${money(a.current)}</strong></div>
      <div class="card-actions"><button class="small-btn" data-details="${a.id}">Details</button><button class="small-btn" data-bid="${a.id}">Bid Now</button></div>
    </div></article>`;
}

function bindDynamic(){
  $$('[data-heart]').forEach(b=>on(b,'click',()=>toggleWish(+b.dataset.heart)));
  $$('[data-details]').forEach(b=>on(b,'click',()=>details(+b.dataset.details)));
  $$('[data-bid]').forEach(b=>on(b,'click',()=>placeBid(+b.dataset.bid)));
  $$('[data-editbid]').forEach(b=>on(b,'click',()=>editBid(+b.dataset.editbid)));
  $$('[data-removebid]').forEach(b=>on(b,'click',()=>removeBid(+b.dataset.removebid)));
}

function renderRecommendations(list=auctions.slice(4,8)){
  const el=$("#recommendGrid"); if(!el)return;
  el.innerHTML=list.map(auctionCard).join(""); bindDynamic();
}
function renderDashboard(){
  const el=$("#dashboardRows"); if(!el)return;
  el.innerHTML=auctions.slice(0,4).map(a=>`<div class="bid-row">
    <div class="item-cell"><img src="${a.img}" alt="${a.name}" onerror="this.style.background='#3b1d0e';this.src=''"><div><b>${a.name}</b><small>${a.cat}</small></div></div>
    <span>${money(a.current)}</span><span>${money(a.your)}</span><span>${a.time}</span>
    <span><em class="status ${a.status}">${a.status==="leading"?"Leading":a.status==="outbid"?"Outbid":"Ended"}</em></span>
    <span><button class="small-btn" data-details="${a.id}">View</button></span></div>`).join("");
  bindDynamic();
}
function renderMyBids(){
  const el=$("#myBidsGrid"); if(!el)return;
  const list=auctions.filter(a=>currentFilter==="all"||a.status===currentFilter);
  el.innerHTML=list.length?list.map(a=>`<article class="bid-card"><img src="${a.img}" alt="${a.name}" onerror="this.style.background='#3b1d0e';this.src=''"><div class="bid-card-body"><h3>${a.name}</h3><p class="meta">${a.cat} · ${a.time}</p><span class="status ${a.status}">${a.status==="leading"?"Leading":a.status==="outbid"?"Outbid":"Ended"}</span><div class="bid-values"><div><small>Current bid</small><b>${money(a.current)}</b></div><div><small>Your bid</small><b>${money(a.your)}</b></div></div><div class="card-actions"><button class="small-btn" data-editbid="${a.id}">Edit Bid</button><button class="small-btn" data-details="${a.id}">Details</button><button class="small-btn" data-removebid="${a.id}">Remove</button></div></div></article>`).join(""):`<div class="empty-card"><h2>No bids found</h2><p>Try another filter.</p></div>`;
  bindDynamic();
}
function renderWishlist(){
  const el=$("#wishlistGrid"); if(!el)return;
  const list=auctions.filter(a=>wishlist.has(a.id));
  el.innerHTML=list.length?list.map(auctionCard).join(""):`<div class="empty-card"><h2>Nothing in Watching</h2><p>Tap the heart on any auction to save it.</p></div>`;
  bindDynamic();
}
function renderNotifications(){
  const el=$("#notificationList"); if(!el)return;
  const notes=[["♢","You have been outbid","Someone placed a higher bid on Vintage Camera.","2 minutes ago",true],["♜","Congratulations!","You won the Antique Wooden Chair auction.","1 hour ago",true],["◷","Auction ending soon","Diamond Necklace ends in less than an hour.","3 hours ago",true],["♥","Watching update","A saved item has received a new bid.","Yesterday",false]];
  el.innerHTML=notes.map(n=>`<div class="notice ${n[4]?"unread":""}"><div class="notice-icon">${n[0]}</div><div><h3>${n[1]}</h3><p>${n[2]}</p><time>${n[3]}</time></div></div>`).join("");
}
function renderAll(){renderDashboard();renderRecommendations();renderMyBids();renderWishlist();renderNotifications();updateCounts();updateProfileUI();}

function details(id){
  const a=auctions.find(x=>x.id===id); if(!a)return;
  openModal(`<h2>${a.name}</h2><p class="muted">${a.cat}</p><img class="detail-image" src="${a.img}" alt="${a.name}"><p class="muted">${a.desc}</p><div class="detail-price">${money(a.current)}</div><p class="muted">Current bid · ${a.time}</p><div class="modal-actions"><button class="outline-btn" id="modalWish">${wishlist.has(id)?"♥ Watching":"♡ Add to Watching"}</button><button class="gold-btn" id="modalBid">Place / Edit Bid</button></div>`);
  on("#modalWish","click",()=>{toggleWish(id);closeModal();}); on("#modalBid","click",()=>placeBid(id));
}
function placeBid(id){
  const a=auctions.find(x=>x.id===id);if(!a)return;if(a.status==="ended"){toast("This auction has ended");return;}
  openModal(`<h2>Place Bid</h2><p class="muted">${a.name} · Current bid ${money(a.current)}</p><div class="form-group"><label>Your bid amount</label><input id="newBid" type="number" min="${a.current+100}" value="${a.current+500}"></div><div class="modal-actions"><button class="outline-btn" id="cancelBid">Cancel</button><button class="gold-btn" id="confirmBid">Confirm Bid</button></div>`);
  on("#cancelBid","click",closeModal);on("#confirmBid","click",()=>{const v=Number($("#newBid")?.value);if(!Number.isFinite(v)||v<=a.current){toast("Enter a bid higher than the current bid");return;}a.your=v;a.current=v;a.status="leading";closeModal();renderAll();toast("Bid placed successfully");});
}
function editBid(id){
  const a=auctions.find(x=>x.id===id);if(!a)return;
  openModal(`<h2>Edit Your Bid</h2><p class="muted">${a.name}</p><div class="form-group"><label>Bid amount</label><input id="editBidValue" type="number" min="${a.current+100}" value="${a.your}"></div><div class="modal-actions"><button class="outline-btn" id="cancelEdit">Cancel</button><button class="gold-btn" id="saveBid">Save Bid</button></div>`);
  on("#cancelEdit","click",closeModal);on("#saveBid","click",()=>{const v=Number($("#editBidValue")?.value);if(!Number.isFinite(v)||v<=0){toast("Enter a valid bid amount");return;}if(a.status==="outbid"&&v<=a.current){toast("Your bid must be above the current bid");return;}a.your=v;if(v>=a.current)a.status="leading";closeModal();renderAll();toast("Bid updated successfully");});
}
function removeBid(id){
  const a=auctions.find(x=>x.id===id);if(a&&confirm("Remove this bid from My Bids?")){a.status="ended";renderAll();toast("Bid removed");}
}
function editProfile(){
  openModal(`<h2>Edit Profile</h2><div class="form-grid"><div class="form-group"><label>Full name</label><input id="fName" value="${profile.name}"></div><div class="form-group"><label>Email</label><input id="fEmail" value="${profile.email}"></div><div class="form-group"><label>Phone</label><input id="fPhone" value="${profile.phone}"></div><div class="form-group"><label>Location</label><input id="fLocation" value="${profile.location}"></div><div class="form-group full-field"><label>Address</label><textarea id="fAddress">${profile.address}</textarea></div></div><div class="modal-actions"><button class="outline-btn" id="cancelProfile">Cancel</button><button class="gold-btn" id="saveProfile">Save Changes</button></div>`);
  on("#cancelProfile","click",closeModal);on("#saveProfile","click",()=>{profile.name=$("#fName").value.trim()||"Rahul Sharma";profile.email=$("#fEmail").value.trim();profile.phone=$("#fPhone").value.trim();profile.location=$("#fLocation").value.trim();profile.address=$("#fAddress").value.trim();updateProfileUI();closeModal();toast("Profile updated successfully");});
}
function showInfo(title,text){openModal(`<h2>${title}</h2><p class="muted">${text}</p><div class="modal-actions"><button class="gold-btn" id="infoOk">OK</button></div>`);on("#infoOk","click",closeModal);}

function renderSearch(query=""){
  const box=$("#searchResults"); if(!box)return;
  const q=query.trim().toLowerCase();
  if(!q){box.classList.remove("show");box.innerHTML="";return;}
  const list=auctions.filter(a=>(a.name+" "+a.cat).toLowerCase().includes(q));
  box.innerHTML=list.length?list.slice(0,6).map(a=>`<button class="search-result" data-search-id="${a.id}"><img src="${a.img}" alt=""><div><b>${a.name}</b><small>${a.cat} · ${a.time}</small></div><strong>${money(a.current)}</strong></button>`).join(""):`<div class="search-empty">No auctions found for “${query}”</div>`;
  box.classList.add("show");
  $$('[data-search-id]').forEach(b=>on(b,'click',()=>{box.classList.remove("show");details(+b.dataset.searchId);}));
}
function doSearch(){
  const input=$("#searchInput"),q=input?.value.trim();if(!q){toast("Type an auction name or category to search");input?.focus();return;}
  const list=auctions.filter(a=>(a.name+" "+a.cat).toLowerCase().includes(q.toLowerCase()));
  $("#searchResults")?.classList.remove("show");
  if(list.length===1){details(list[0].id);return;}
  openModal(`<h2>Search Results</h2><p class="muted">${list.length} auction${list.length===1?"":"s"} found for “${q}”.</p><div class="search-modal-list">${list.length?list.map(a=>`<button class="search-result modal-result" data-search-modal="${a.id}"><img src="${a.img}" alt=""><div><b>${a.name}</b><small>${a.cat} · ${a.time}</small></div><strong>${money(a.current)}</strong></button>`).join(""):`<div class="search-empty">No matching auctions found.</div>`}</div>`);
  $$('[data-search-modal]').forEach(b=>on(b,'click',()=>details(+b.dataset.searchModal)));
}

// Top navigation: dashboard works inside this module; the other requested pages are placeholders.
document.addEventListener("click",e=>{
  const sec=e.target.closest("[data-section]");
  if(sec){e.preventDefault();showSection(sec.dataset.section);return;}
  const top=e.target.closest("[data-top]");
  if(top){const t=top.dataset.top;toast(t==="auctions"?"Auctions page is outside this dashboard module.":t==="categories"?"Categories page is outside this dashboard module.":t==="help"?"Help & Support page is outside this dashboard module.":"Home page is outside this dashboard module.");}
});

on("#profileTrigger","click",e=>{e.stopPropagation();$("#profileDropdown")?.classList.toggle("show");});
document.addEventListener("click",e=>{if(!e.target.closest(".profile-menu-wrap"))$("#profileDropdown")?.classList.remove("show");});
on("#editProfileBtn","click",editProfile);on("#dropdownEditProfile","click",editProfile);
on("#notificationBtn","click",()=>showSection("notifications"));
on("#viewMoreBtn","click",()=>showSection("mybids"));
on("#markReadBtn","click",()=>{$$(".notice").forEach(n=>n.classList.remove("unread"));toast("All notifications marked as read");});
on("#sortBidsBtn","click",()=>{auctions.reverse();renderAll();toast("Bids sorted");});
$$('.filter').forEach(b=>on(b,'click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentFilter=b.dataset.filter;renderMyBids();}));
on("#saveSettingsBtn","click",()=>{localStorage.setItem("bidnestSettings",JSON.stringify({dark:$("#darkToggle").checked,bid:$("#bidAlert").checked,auction:$("#auctionAlert").checked,public:$("#publicProfile").checked}));toast("Settings saved successfully");});
on("#darkToggle","change",()=>document.body.classList.toggle("light-mode",!$("#darkToggle").checked));
on("#changePasswordBtn","click",()=>openModal(`<h2>Change Password</h2><div class="form-group"><label>Current password</label><input type="password"></div><div class="form-group"><label>New password</label><input type="password"></div><div class="form-group"><label>Confirm new password</label><input type="password"></div><div class="modal-actions"><button class="outline-btn" id="cancelPassword">Cancel</button><button class="gold-btn" id="updatePassword">Update Password</button></div>`));
on("#deleteAccountBtn","click",()=>{if(confirm("Delete this demo account?"))toast("Demo account deletion requested");});
on("#sellItemBtn","click",()=>showInfo("Sell an Item","Your seller form can be connected to the backend here. This demo is ready for integration."));
on("#manageListingsBtn","click",()=>showInfo("My Listings","You have 2 active listings and 1 completed auction in this demo."));
on("#addFundsBtn","click",()=>showInfo("Add Funds","Demo wallet: no real payment is processed."));
on("#transactionBtn","click",()=>showInfo("Transactions","No real transactions are connected in this frontend demo."));
on("#withdrawBtn","click",()=>showInfo("Withdraw","Withdrawal is disabled in this frontend demo."));
$$('[data-message]').forEach(b=>on(b,'click',()=>showInfo(b.dataset.message,"This is a demo message. Connect your backend to send and receive real messages.")));

on("#searchInput","input",e=>renderSearch(e.target.value));
on("#searchInput","keydown",e=>{if(e.key==="Enter"){e.preventDefault();doSearch();}});
on("#searchInput","focus",e=>{if(e.target.value.trim())renderSearch(e.target.value);});
document.addEventListener("click",e=>{if(!e.target.closest(".search-box")&&!e.target.closest(".search-results"))$("#searchResults")?.classList.remove("show");});

on("#modalClose","click",closeModal);on("#modalBackdrop","click",e=>{if(e.target.id==="modalBackdrop")closeModal();});

const saved=localStorage.getItem("bidnestSettings");
if(saved){try{const s=JSON.parse(saved);if($("#darkToggle"))$("#darkToggle").checked=s.dark!==false;if($("#bidAlert"))$("#bidAlert").checked=s.bid!==false;if($("#auctionAlert"))$("#auctionAlert").checked=s.auction!==false;if($("#publicProfile"))$("#publicProfile").checked=s.public!==false;document.body.classList.toggle("light-mode",!$("#darkToggle")?.checked);}catch(e){}}

renderAll();
document.addEventListener("DOMContentLoaded", function () {

    const pages = document.querySelectorAll(".page");
    const sideButtons = document.querySelectorAll(".side-btn");
    const pageButtons = document.querySelectorAll("[data-page]");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let toastTimer;

    function showToast(message) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }


    function openPage(pageName) {

        const targetPage = document.getElementById(pageName);

        if (!targetPage) {
            return;
        }


        /* Hide every page */

        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });


        /* Show selected page */

        targetPage.classList.add("active-page");


        /* Update left sidebar active button */

        sideButtons.forEach(function (button) {

            button.classList.remove("active");

            if (button.dataset.page === pageName) {
                button.classList.add("active");
            }

        });


        /* Scroll content to top */

        const content = document.querySelector(".content");

        if (content) {
            content.scrollTop = 0;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        /* Change browser hash without reloading */

        history.replaceState(null, "", "#" + pageName);

    }

    sideButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const pageName = button.dataset.page;

            openPage(pageName);

        });

    });


    pageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const pageName = button.dataset.page;

            openPage(pageName);

        });

    });

    const heroButton = document.querySelector(".hero-btn");

    if (heroButton) {

        heroButton.addEventListener("click", function () {

            openPage("auctions");

            showToast("Opening My Auctions");

        });

    }

    const heartButtons = document.querySelectorAll(
        ".heart-btn, .remove-heart"
    );


    heartButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.stopPropagation();

            const icon = button.querySelector("i");

            if (!icon) {
                return;
            }


            if (
                icon.classList.contains("fa-regular")
            ) {

                icon.classList.remove("fa-regular");

                icon.classList.add("fa-solid");

                button.classList.add("liked");

                showToast("Item added to wishlist");

            } else {

                icon.classList.remove("fa-solid");

                icon.classList.add("fa-regular");

                button.classList.remove("liked");

                showToast("Item removed from wishlist");

            }

        });

    });


    const bidButtons = document.querySelectorAll(
        ".bid-btn, .small-action"
    );


    bidButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const text = button.textContent.trim();

            if (text.includes("Edit")) {

                showToast("Auction edit page opened");

            } else if (text.includes("Increase")) {

                showToast("Bid amount can be increased");

            } else if (text.includes("Details")) {

                showToast("Auction details opened");

            } else if (text.includes("Bid")) {

                showToast("Bid window opened");

            } else {

                showToast("Action completed");

            }

        });

    });


    const messageButtons =
        document.querySelectorAll(".message-btn");


    messageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            showToast("Opening message");

        });

    });

    const createAuctionBtn =
        document.getElementById("createAuctionBtn");


    if (createAuctionBtn) {

        createAuctionBtn.addEventListener("click", function () {

            showToast("Create Auction form opened");

        });

    }


    const addFundsBtn =
        document.getElementById("addFundsBtn");


    if (addFundsBtn) {

        addFundsBtn.addEventListener("click", function () {

            showToast("Add Funds option selected");

        });

    }


    const notificationBtn =
        document.getElementById("notificationBtn");


    if (notificationBtn) {

        notificationBtn.addEventListener("click", function () {

            showToast("You have 3 new notifications");

        });

    }




    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                const searchValue =
                    searchInput.value.trim();


                if (searchValue === "") {

                    showToast("Please enter an auction name");

                } else {

                    showToast(
                        'Searching for "' +
                        searchValue +
                        '"'
                    );

                }

            }

        });

    }


    const settingButtons =
        document.querySelectorAll(".setting-action");


    settingButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            showToast(
                button.textContent.trim() +
                " option selected"
            );

        });

    });


    const hash =
        window.location.hash.replace("#", "");


    if (
        hash &&
        document.getElementById(hash)
    ) {

        openPage(hash);

    } else {

        openPage("dashboard");

    }

    const disabledNav =
        document.querySelectorAll(".nav-disabled");


    disabledNav.forEach(function (navItem) {

        navItem.addEventListener("click", function (event) {

            event.preventDefault();

            event.stopPropagation();

        });

    });

});
