let allCostomers = [];
let selectedCustomers = []
let customerCount = 0;
let itemsOnPage = 10;

const searchCustomer = (event) => {
  const usernameInput = document.getElementById('username');
  const pwdInput = document.getElementById('pwd');
  const retailerIdInput = document.getElementById('retailer-Id');
  const username = usernameInput.value;
  const pwd = pwdInput.value;
  const retailerId = retailerIdInput.value;
  const errorDiv = document.getElementById('error-msg');

  updateAllCustomersCheckedStatus(false, false);

  if (!username || !pwd || !retailerId) {
    $(errorDiv).removeClass('hide');
  } else {
    $(errorDiv).addClass('hide');

    resetFields();
    // Remove not data row.
    const noDataRow = document.getElementById('no-data-row')
    if (noDataRow) noDataRow.remove();

    const customer = {
      id: ++customerCount,
      username,
      pwd,
      retailerId
    }
    allCostomers.push(customer);
    putPagination()
  }
}

const putPagination = () => {
  const row = document.getElementById('pagination-row')
  row.classList.remove('hide');

  $('#pagination-steps').pagination({
    items: allCostomers.length,
    itemsOnPage,
    cssStyle: 'light-theme',
    onInit: () => {
      onPageChange(1);
    },
    onPageClick: (pageNumber, evt) => {
      onPageChange(pageNumber)
    }
  });
}

const onPageChange = (pageNumber) => {
  const table = $('#customer-list');
  const tableTBody = $('#customer-list tbody');

  updateAllCustomersCheckedStatus(false, false);
  $("#customer-list tbody tr").remove();
  const pageData = allCostomers.slice((pageNumber - 1) * itemsOnPage, (pageNumber - 1) * itemsOnPage + itemsOnPage)
  let isAllCheck = true;
  $(pageData).each((index, customer) => {
    const isChecked = selectedCustomers.findIndex((customerId) => (customerId === customer.id)) !== -1;
    if(!isChecked) {
      isAllCheck = false
    };

    const row = `
      <tr>
        <td><input ${isChecked ? 'checked' : ''} data-id="${customer.id}" class="customer-checkbox" onchange="onClick(${customer.id})" name="customer-checkbox-${customer.id}" value="${customer.id}" type="checkbox"></td>
        <td>${customer.id}</td>
        <td>${customer.username}</td>
        <td>${customer.retailerId}</td>
      </tr>
    `;
    $(tableTBody).append(row);
  })
  const checkbox = document.getElementsByName('select_current_page_all');
  checkbox[0].checked = isAllCheck;
  const selectAllCheckbox = document.getElementsByName('select_all');
  selectAllCheckbox[0].checked = selectedCustomers.length === allCostomers.length;
}

const onPageItemCountChange = (count) => {
  itemsOnPage = +count <= 0 ? 10 : count;
  putPagination();
}

const onClick = (customerId) => {
  const checkbox = document.getElementsByName(`customer-checkbox-${customerId}`);
  const selectAllCheckbox = document.getElementsByName('select_all');
  if (checkbox && checkbox[0].checked) {
    selectedCustomers.push(+customerId);
  } else {
    const index = selectedCustomers.indexOf(customerId);
    if (index !== -1) selectedCustomers.splice(index, 1);
  }

  const allCheckBoxes = document.getElementsByClassName('customer-checkbox');
  let allChecked = true;

  [...allCheckBoxes].forEach((chckbx) => {
    if(!chckbx.checked) allChecked = false;
  });

  const selecteCurrentPageCheckBox = document.getElementsByName('select_current_page_all');
  selecteCurrentPageCheckBox[0].checked = allChecked;


  selectAllCheckbox[0].checked = !!(
    selectedCustomers.length &&
    selectedCustomers.length === allCostomers.length
  );
}

const checkCurrentPageAll = () => {
  const checkbox = document.getElementsByName('select_current_page_all');
  const allCheckBoxes = document.getElementsByClassName('customer-checkbox');
  [...allCheckBoxes].forEach((chckbx) => {
    chckbx.checked = checkbox && checkbox[0] && checkbox[0].checked
    const index = selectedCustomers.indexOf(+chckbx.dataset.id)
    if (checkbox && checkbox[0] && checkbox[0].checked && index === -1) {
      selectedCustomers.push(+chckbx.dataset.id);
    } else if (index !== -1) {
      selectedCustomers.splice(index, 1)
    }
  });
  const selectAllCheckbox = document.getElementsByName('select_all');
  selectAllCheckbox[0].checked = selectedCustomers.length === allCostomers.length;
}

const checkAll = () => {
  const checkbox = document.getElementsByName('select_all');
  if (checkbox && checkbox[0] && checkbox[0].checked) {
    updateAllCustomersCheckedStatus(true)
  } else {
    updateAllCustomersCheckedStatus(false)
    selectedCustomers = []
  }
}

const updateAllCustomersCheckedStatus = (checked, reset = true) => {
  const allCustomersCheckBoxes = document.getElementsByClassName('customer-checkbox');
  const allCustomersCheckBoxesArray = [...allCustomersCheckBoxes];
  const selectAllCheckbox = document.getElementsByName('select_all');
  selectAllCheckbox[0].checked = checked;
  $(allCustomersCheckBoxesArray).each((index, inputCheckbox) => {
    // if (checked) {
    //   selectedCustomers.push(+inputCheckbox['dataset'].id)
    // }
    inputCheckbox.checked = checked;
  })
  if (reset) {
    selectedCustomers = [];
  }
  if (checked) {
    $(allCostomers).each((index, customer) => {
      selectedCustomers.push(customer.id);
    })
  }
}

// https://jsfiddle.net/gyrocode/abhbs4x8/
const resetFields = () => {
  try {
    document.getElementById('username').value = '';
    document.getElementById('pwd').value = '';
    document.getElementById('retailer-Id').value = '';
  } catch (e) {
    console.log('-error-', e)
  }
}

const onReadSpamService = () => {
  document.getElementById('selected-customer-ids').innerHTML = JSON.stringify(selectedCustomers)
  updatePrgressBar(75)
}

const updatePrgressBar = (percentage) => {
  document.getElementById('percentage-bar').style.width = `${percentage}%`;
}



// Create dummy data.
const createDummyData = () => {

  for (let i = 0; i < 50; i++) {

    const customer = {
      id: ++customerCount,
      username: 'dummy-user-' + (i + 1),
      pwd: 'pwd123',
      retailerId: 'ret-' + (i + 1)
    }
    allCostomers.push(customer);
  }
  putPagination()
}

$(document).ready(() => {
  createDummyData();
})