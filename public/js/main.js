var prductDis = "";
var setColor = "";
var setSize = "";
var setPrice = 0;
var cartItem = "";

var selectColor = "No colors";
var selectSize = "No Size";
loadAllProduct();

/* featching data from server */
async function loadAllProduct() {
  const getRespond = await fetch("http://localhost:8080/products");
  const product = await getRespond.json();

  displayproduct(product);
}

// featch all product data
function displayproduct(data) {
  //destructuring object
  const { product, color, size } = data;
  let getColor = allColor(color);
  let getSize = allSize(size);
  product.map((item) => {
    prductDis += `<div class="col-lg-3 col-md-4 col-sm-6">
              <div class="single-item">
                        <div class="image-area">
                            <a href="#!">
                                <img src=${item.image} class="img-active" alt="Product Image"/>
                            </a>
                            <a href="#!">
                                <img src=${item.image2} class="img-hover" alt="Product Image"/>
                            </a>
                            <div class="action">
                                <ul>
                                  ${getColor}
                                </ul>
                            </div>
                            <div class="size">
                                <ul class="d-flex">
                                  ${getSize}
                                </ul>
                            </div>
                        </div>
                        <div class="bottom-area" data-id=${item.id} data-image=${item.image}>
                                <h5 class='product-name'>${item.name}</h5>
                            <p>$ </p><p class="price" data-price="${item.price}">${item.price}</p>
                            <a href="#!" class="add-cart button-style1">add to cart <span class="btn-dot"></span></a>
                        </div>
                    </div>
                    </div>
                </div>`;
  });

  /* push all product in html */
  document.querySelector(".product-items").innerHTML = prductDis;
  let cartBtn = document.querySelectorAll(".add-cart");

  /* select color */
  document.querySelectorAll(".select-color").forEach((c) => {
    c.addEventListener("click", function () {
      selectColor = c.getAttribute("data-color");
      alert("Color selected");
    });
  });

  /* select size */
  document.querySelectorAll(".select-size").forEach((c) => {
    c.addEventListener("click", function () {
      selectSize = c.getAttribute("data-size");
      alert("Size Selected");
    });
  });

  cartBtn.forEach((cart) => {
    cart.addEventListener("click", function () {
      let cartItems = {
        SalePrice: Number(cart.parentElement.querySelector(".price").innerHTML),
        Color: selectColor,
        Size: selectSize,
        ProductName:
          cart.parentElement.querySelector(".product-name").innerHTML,
        Id: Number(cart.parentElement.getAttribute("data-id")),
        Image: cart.parentElement.getAttribute("data-image"),
      };
      shopingCart.addToCart(cartItems);
      // displayCart();
      alert("Product add to card");
    });
  });
}
// all setColor
function allColor(color) {
  color.map((item) => {
    setColor += `<li class="select-color" data-color=${item.color}><a href="#!" style='background:${item.color}'> </a></li>`;
  });
  return setColor;
}

// all setSize
function allSize(size) {
  size.map((item) => {
    setSize += `<li class="select-size" data-size=${item.size}><a href='#!'>${item.size}</a></li>`;
  });
  return setSize;
}

function displayCart() {
  shopingCart.reurnProduct().map((item) => {
    cartItem += ` <li>
                  <div class="d-flex position-relative">
                      <img src=${item.Image} alt="Product Image"/>
                      <div class="text">
                          <a href="#!">
                              <h5>${item.ProductName}</h5>
                          </a>
                          <p>${item.Qty} X ${item.SalePrice}</p>
                          <a href="#!" class="icon delete-cart-items" data-id= ${item.Id} >
                              X
                          </a>
                          <div class="color-size d-flex justify-content-between">
                            <span class="size">${item.Size}</span>
                            <span class='color' style='background: ${item.Color}'></span>
                          </div>
                      </div>
                  </div>
              </li>`;
  });

  document.querySelector(".procut-items").innerHTML = cartItem;
  document.querySelector(".quantity").innerHTML = shopingCart.totalProduct();
}

/* shoping cart functionlity */
const shopingCart = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  addToCart(product) {
    let addItem = this.addCartFormate(product);
    if (!this.checkProduct(addItem)) {
      this.cart.push(addItem);
      this.toralAmount();
      this.saveCart();
      this.totalProduct();
      displayCart();
      //console.table(this.cart);
      return true;
      //  alert('Product Add successfully in Cart');
    } else {
      return false;
      // alert('Product already in Cart');
    }
  },

  addCartFormate(item) {
    return {
      Id: item.Id,
      ProductName: item.ProductName,
      SalePrice: item.SalePrice,
      Image: item.Image,
      Qty: 1,
      Size: item.Size,
      Color: item.Color,
    };
  },
  checkProduct(item) {
    let haveproduct = false;
    this.cart.forEach((items) => {
      if (items.Id === item.Id) {
        alert("Item Allready Exsist");
        haveproduct = true;
      }
    });

    return haveproduct;
  },
  // Product Increment
  cartPlus(cartProduct) {
    this.cart.forEach((product) => {
      if (product.Id === cartProduct.Id) {
        product.Qyt = ++cartProduct.Qty;
        //console.log(++product.qyt);
        this.saveCart();
        //
      }
    });
  },
  // Product Increment
  cartMinus(cartProduct) {
    this.cart.forEach((product) => {
      if (product.Id === cartProduct.Id) {
        if (cartProduct.Qty > 1) {
          product.Qyt = --cartProduct.Qty;
          //console.log(++product.qyt);
          this.saveCart();
        }

        //
      }
    });
  },

  totalProduct() {
    let procont = 0;
    this.cart.forEach((product) => {
      procont = procont + parseFloat(product.Qty);
    });
    return procont;
  },

  toralAmount() {
    let amount = 0;
    this.cart.forEach((product) => {
      amount = amount + parseFloat(product.SalePrice) * parseFloat(product.Qty);
    });
    return amount;
  },
  // delete from cart

  itemDelete(cartProduct) {
    //cart = cart.filter(cartItem => cartItem.name !== product.name);
    this.cart = this.cart.filter((cartItem) => cartItem.Id !== cartProduct.Id);
    this.saveCart();
  },

  // Save Cart
  saveCart() {
    this.toralAmount();
    localStorage.setItem("cart", JSON.stringify(this.cart));
  },

  reurnProduct() {
    this.toralAmount();
    return this.cart;
  },
};

window.onload = function () {
  document.querySelector(".quantity").innerHTML = shopingCart.totalProduct();
  document.querySelector(".item-count").innerHTML = shopingCart.totalProduct();
  document.querySelector(".total-amount").innerHTML = shopingCart.toralAmount();
  displayCart();
};

document.querySelector("#show-card1").addEventListener("click", function (e) {
  // e.preventDefault();
  displayCart();
  console.log("dfdf");
});
