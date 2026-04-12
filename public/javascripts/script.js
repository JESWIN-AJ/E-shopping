
function addToCart(proid) {

  $.ajax({
    url: '/add-to-cart/' + proid,
    method: 'get',
    success: (response) => {
      if (response.status) {
        let count = ('#cart-count').html()
        count = parseInt(count) + 1
          ('#cart-count').html(count)
      }
      alert(response)
    }
  })

}

function increaseProduct(cartId, proId, count) {
  $.ajax({
    url: '/changeproduct-quantity',
    data: {
      cart: cartId,
      product: proId,
      count: count
    },
    method: 'post',
    success: (response) => {
      console.log(response);
      const qtySpan = $(`button[onclick="increaseProduct('${cartId}','${proId}',1)"]`).siblings('.qty-val');
      qtySpan.text(parseInt(qtySpan.text()) + 1);
    },

    error: (err) => {
      console.log(err); // ✅ Check this in F12 console
    }
  });
}

function decreaseProduct(cartId, proId, count) {
  $.ajax({
    url: '/changeproduct-quantity',
    data: {
      cart: cartId,
      product: proId,
      count: count
    },
    method: 'post',
    success: (response) => {
      const qtySpan = $(`button[onclick="increaseProduct('${cartId}','${proId}',1)"]`).siblings('.qty-val');
      qtySpan.text(parseInt(qtySpan.text()) - 1);

      let newVal = parseInt(qtySpan.text());
      if (newVal <= 1) {
        $(`button[onclick="decreaseProduct('${cartId}','${proId}',-1)"]`).prop('disabled', true);

      }
    }
    })
}

$(document).ready(() => {
  $('.qty-val').each(function () {
    const qty = parseInt($(this).text());
    const proId = $(this).siblings('button').last().attr('onclick').match(/'([^']+)'/g)[1].replace(/'/g, '');

    if (qty <= 1) {
      $(`#dec-${proId}`).prop('disabled', true);  // ✅ disable dec if qty is 1
    } else {
      $(`#dec-${proId}`).prop('disabled', false); // ✅ enable dec if qty > 1
    }
  });
});

function removeProduct(cartId, proId) {
  $.ajax({
    url: '/remove-from-cart',
    data: {
      cart: cartId,
      product: proId
    },
    method: 'post',
    success: (response) => {
      if (response.status) {
        // ✅ Instantly remove the row/item from UI
        $(`button[onclick="removeProduct('${cartId}','${proId}')"]`).closest('div').remove();
      }
    }
  });
}


function shipOrder(orderId) {
  console.log("Shipping order:", orderId); // ✅ Check this in F12 console
  $.ajax({
    url: '/admin/ship-order',
    data: {
      id: orderId
    },
    method: 'post',
    success: (response) => {
      if (response.status) {
        location.reload()
        
        $(`#status-${orderId}`).removeClass('badge-success').addClass('badge-info').text('Shipped');
      }
    }
  });
}
