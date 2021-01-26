// Bussiness logic for AddressBook
function AddressBook() {
  this.contacts = {};
  this.currentId = 0;
}

AddressBook.prototype.addContact = function (contact) {
  contact.id = this.assignId();
  this.contacts[contact.id] = contact;
}

AddressBook.prototype.assignId = function () {
  this.currentId += 1;
  return this.currentId;
}

AddressBook.prototype.findContact = function (id) {
  if (this.contacts[id] !== undefined) {
    return this.contacts[id];
  }
  return false;
}

AddressBook.prototype.deleteContact = function (id) {
  if (this.contacts[id] === undefined) {
    return false;
  }
  delete this.contacts[id];
  return true;
}

// Business logic for Contacts
let addressBook = new AddressBook();

function Contact(firstName, lastName, phoneNumber, pAddress) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = {};
  this.phoneNumber = phoneNumber;
  this.pAddress = { pAddress };
}

Contact.prototype.fullName = function () {
  return this.firstName + " " + this.lastName;
}

//email object construction

function displayContactDetails(addressBookToDisplay) {
  let contactsList = $("ul#contacts");
  let htmlForContactInfo = "";
  Object.keys(addressBookToDisplay.contacts).forEach(function (key) {
    const contact = addressBookToDisplay.findContact(key);
    htmlForContactInfo += `<li id='${contact.id}'> ${contact.firstName} ${contact.lastName}</li>`;
  });
  contactsList.html(htmlForContactInfo);
};

function showContact(contactId) {
  const contact = addressBook.findContact(contactId);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".phone-number").html(contact.phoneNumber);

  drawEmailOut(contact);
  // $(".email").html(contact.email);

  $(".PAddress").html(contact.pAddress);
  let buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" + + contact.id + ">Delete</button>");
};

function drawEmailOut(contact) {
  $("#email-out").html("");
  if ("Primary" in contact.email) {
    $("#email-out").html(`<p>Email: ${contact.email["Primary"]}</p>`);
  }
  else {
    const loop = Object.keys(contact.email).length
    let input = ""
    for (i = 0; i < loop; i++) {
      input += `<p>${emailKey(i)}: ${contact.email[emailKey(i)]}</p>`
    }
    $("#email-out").html(input);
  }
};

function emailKey(count) {
  if (count == 0) { return "Personal" }
  else if (count == 1) { return "Work" }
  else { return `Email ${count + 1}` }
};

function attachContactListeners() {
  $("ul#contacts").on("click", "li", function () {
    showContact(this.id);
  });
  // Code below here is new!
  $("#buttons").on("click", ".deleteButton", function () {
    addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    displayContactDetails(addressBook);
  });
};

function drawEmail(counter) {
  $("#emailbox").html("");
  for (i = 0; i < counter; i++) {
    if (counter == 1) {
      $("#emailbox").append(`<input type="text" class="form-control" id="email${i}">`);
    }
    else {
      $("#emailbox").append(`<label>${emailLabel(i)}</label > <input type="text" class="form-control" id="email${i}">`);
    }
  };
};

function emailLabel(i) {
  if (i == 0) { return "Personal" }
  else if (i == 1) { return "Work" }
  else {
    return `Email ${i + 1}`
  }
};

function makeEmailString(counter) {
  let emailString = "{"
  for (i = 0; i < counter; i++) {
    inputEmail = $(`#email${i}`).val()
    emailString += `"${counter == 1 ? "Primary" : emailLabel(i)}":"${inputEmail}"`
    if (i + 1 !== counter) { emailString += "," }
  };
  emailString += "}"
  return emailString
}

// User Interface Logic ---------
currentEmails = 1;

$(document).ready(function () {
  attachContactListeners();
  drawEmail(currentEmails);
  $("form#new-contact").submit(function (event) {
    event.preventDefault();
    const inputtedFirstName = $("input#new-first-name").val();
    const inputtedLastName = $("input#new-last-name").val();
    const inputtedPhoneNumber = $("input#new-phone-number").val();

    const emailString = makeEmailString(currentEmails);

    const inputtedPAddress = $("input#new-PAddress").val();

    // $("input#new-first-name").val("");
    // $("input#new-last-name").val("");
    // $("input#new-phone-number").val("");
    // $("input#new-email").val("");
    // $("input#new-PAddrress").val("");
    $("form#new-contact")[0].reset();

    let newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber, inputtedPAddress);

    newContact.email = JSON.parse(emailString);

    console.log(newContact);
    addressBook.addContact(newContact);
    displayContactDetails(addressBook);
  })

  $("#addEmail").on("click", function () {
    currentEmails = currentEmails + 1;
    drawEmail(currentEmails);
  });
  $("#removeEmail").on("click", function () {
    currentEmails = currentEmails - 1;
    drawEmail(currentEmails);
  });
})