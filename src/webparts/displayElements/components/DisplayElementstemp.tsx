// private async fetchCountriesFromSharePointList() {
//   try {
//     const countriesResponse = await this._sp.web.lists.getByTitle('Country').items.select('ID', 'Title')();
//     const countries = countriesResponse.map(item => ({ ID: item.ID, Title: item.Title }));
//     console.log(countries);
//     this.setState({ countries });
//   } catch (error) {
//     console.error('Error fetching countries from SharePoint:', error);
//   }
// }

// private async fetchUniversitiesFromSharePointList(City: string) {
//   try {
//     const universities: any[] = await this._sp.web.lists.getByTitle('University').items.filter(`City eq '${City}'`).select('ID', 'Title')();
//     this.setState({ universities });
//   } catch (e) {
//     console.error(e);
//   }
// }

// private async fetchProgramsFromSharePointList(selectedUniversity: string) {
//   try {
//     const programs: any[] = await this._sp.web.lists.getByTitle('Program').items
//       .select('ID', 'Title', 'University/Title')
//       .expand('University')
//       .filter(`University/Title eq '${selectedUniversity}'`)();
//     this.setState({ programs });
//   } catch (error) {
//     console.error('Error fetching programs from SharePoint:', error);
//   }
// }

// // private async fetchProgramsFromSharePointList(University: string) {
// //   try {
// //     const programs: any[] = await this._sp.web.lists.getByTitle('Program').items.filter(`University eq '${University}'`).select('ID', 'Title')();
// //     this.setState({ programs });
// //   } catch (e) {
// //     console.error(e);
// //   }
// // }

// // /// TEMP CODE
// // private handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// //   // const selectedCountry = event.target.value;
// //   // this.setState({ selectedCountry, selectedCity: '', selectedUniversity: '', selectedProgram: '', cities: [], universities: [], programs: [] });
// //   // if (selectedCountry) {
// //   //   this.fetchCitiesFromSharePointList(selectedCountry);
// //   // }
// //   this.setState({ selectedCountry: event.target.value });
// // };

// private async fetchCitiesFromSharePointList() {
//   try {
//     const cities: any[] = await this._sp.web.lists.getByTitle('City').items.select('ID', 'Title')();
//     this.setState({ cities });
//   } catch (e) {
//     console.error(e);
//   }
// }

// private handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//   const selectedCity = event.target.value;
//   this.setState({ selectedCity, selectedUniversity: '', selectedProgram: '', universities: [], programs: [] });
//   if (selectedCity) {
//     this.fetchUniversitiesFromSharePointList(selectedCity);
//   }
// };

// // private handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// //   const selectedUniversity = event.target.value;
// //   this.setState({ selectedUniversity, programs: [] });
// //   if (selectedUniversity) {
// //     this.fetchProgramsFromSharePointList(selectedUniversity);
// //   }
// // };

// private handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//   const selectedUniversity = event.target.value;
//   this.setState({ selectedUniversity, selectedProgram: '', programs: [] });
//   if (selectedUniversity) {
//     this.fetchProgramsFromSharePointList(selectedUniversity);
//   }
// };

// private handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//   this.setState({ selectedProgram: event.target.value });
// };

// private getAllItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding"
//       )();
//     console.log(items);
//     if (items.length > 0) {
//       var html = `<table><tr><th>ID</th><th>Country</th><th>Industry</th><th>Company</th><th>Funding Info</th></tr>`;
//       items.map((item, index) => {
//         const countryTitle = item.Country ? item.Country.Title : "N/A";
//         const industryTitle = item.Industry ? item.Industry.Title : "N/A";
//         const companyTitle = item.Company ? item.Company.Title : "N/A";
//         const PreviousFundingTitle = item.PreviousFunding
//           ? item.PreviousFunding.Title
//           : "N/A";
//         const thumbnailUrl = item.ThumbnailUrl
//           ? `<img src="${item.ThumbnailUrl}" alt="thumbnail" width="100" height="100">`
//           : "N/A";
//         html += `<tr><td>${item.ID}</td><td>${countryTitle}</td><td>${industryTitle}</td><td>${companyTitle}</td><td>${PreviousFundingTitle}</td><td>${thumbnailUrl}</td></tr>`;
//       });
//       html += `</table>`;
//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;
//       } else {
//         console.error("Element with id 'All Items' not found.");
//       }
//     } else {
//       alert(`List is empty.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };
// private getAllItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding"
//       )();
//     console.log(items);
//     if (items.length > 0) {
//       var html = `<div class="tiles">`;
//       items.map((item, index) => {
//         const country = item.Country ? item.Country : "N/A";
//         const industry = item.Industry ? item.Industry : "N/A";
//         const company = item.Company ? item.Company : "N/A";
//         const previousFunding = item.PreviousFunding
//           ? item.PreviousFunding
//           : "N/A";
//         const thumbnailUrl = item.ThumbnailUrl
//           ? item.ThumbnailUrl
//           : "https://via.placeholder.com/150"; // Placeholder image if no thumbnail URL

//         html += `
//           <div class="tile">
//             <img src="${thumbnailUrl}" alt="thumbnail" class="tile-image" />
//             <div class="tile-content">
//               <div><strong>ID:</strong> ${item.ID}</div>
//               <div><strong>Country:</strong> ${country}</div>
//               <div><strong>Industry:</strong> ${industry}</div>
//               <div><strong>Company:</strong> ${company}</div>
//               <div><strong>Previous Funding:</strong> ${previousFunding}</div>
//               <button class="select-button">Select</button>
//             </div>
//           </div>`;
//       });
//       html += `</div>`;
//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;
//         // Add event listeners to the buttons
//         const selectButtons = document.querySelectorAll(".select-button");
//         selectButtons.forEach((button) => {
//           button.addEventListener("click", () => {
//             console.log("Selected");
//           });
//         });
//       } else {
//         console.error("Element with id 'allItems' not found.");
//       }
//     } else {
//       alert(`List is empty.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };

// public componentDidMount() {
//   // this.fetchCountriesFromSharePointList();
//   this.fetchCitiesFromSharePointList();

// }

// public render(): React.ReactElement<IDisplayElementsProps> {
//   return (
//     <div className={styles.spfxCrudPnp}>
//       <div className={styles.container}>
//         <div className={styles.row}>
//           <div className={styles.column}>
//             <div className={styles.itemField}>
//               <div className={styles.fieldLabel}>Item ID:</div>
//               <input type="text" id='itemId'></input>
//             </div>
//             <div className={styles.itemField}>
//               <div className={styles.fieldLabel}>Country</div>
//               <input type="text" value={this.state.selectedCountry}  placeholder="Enter country"></input>
//             </div>
//             <div className={styles.itemField}>
//               <div className={styles.fieldLabel}>Industry</div>
//               <input type="text" value={this.state.selectedIndustry}  placeholder="Enter industry"></input>
//             </div>
//             <div className={styles.itemField}>
//               <div className={styles.fieldLabel}>Company</div>
//               <input type="text" value={this.state.selectedCompany} placeholder="Enter company"></input>
//             </div>
//             <div className={styles.itemField}>
//               <div className={styles.fieldLabel}>Funding Information</div>
//               <input type="text" value={this.state.selectedFundingInfo}  placeholder="Enter funding information"></input>
//             </div>
//             <div className={styles.buttonSection}>
//               <div className={styles.button}>
//                 <span className={styles.label} onClick={this.getAllItems}>Read All</span>
//               </div>
//               <div className={styles.button}>
//                 <span className={styles.label} onClick={this.undoRead}>Undo Read</span>
//               </div>
//               <div className={styles.button}>
//                 <span className={styles.label} onClick={this.getItemByID}>Read Item</span>
//               </div>
//             </div>
//             <div className={styles.itemField}>
//               <div className={styles.fieldLabel}>All Items</div>
//               <div id="allItems"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

// }

// Function to add an item to the shortlisted items list

// private addToShortlist = (id: string, company: string, date: string) => {
//   this.setState((prevState) => ({
//     shortlistedItems: [...prevState.shortlistedItems, { id, company, date }],
//   }));
// };

// @ts-ignore

//   try {

// private getAllItems = async () => {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding"
//       )();

//     if (items.length > 0) {
//       var html = `<style>
//       .tiles {
//         display: grid;
//         grid-template-columns: repeat(3, 1fr);
//         gap: 20px;
//       }
//       .tile {
//         display: flex;
//         flex-direction: column;
//         border: 1px solid #ddd;
//         border-radius: 5px;
//         overflow: hidden;
//       }
//       .tile-image {
//         width: 100%;
//         height: 200px; /* Set the desired height for the images */
//         object-fit: cover;
//       }
//       .tile-content {
//         padding: 10px;
//         text-align: left;
//       }
//       .tile-title {
//         font-weight: bold;
//         margin-bottom: 5px;
//       }
//       .tile-info {
//         font-size: 14px;
//       }
//       .shortlist-button {
//         background-color: #0078d4;
//         color: #fff;
//         border: none;
//         border-radius: 3px;
//         padding: 5px 10px;
//         cursor: pointer;
//         margin-top: auto;
//       }
//     </style>
//     <div class="tiles">`;

//       items.map((item, index) => {
//         const country = item.Country ? item.Country : "N/A";
//         const industry = item.Industry ? item.Industry : "N/A";
//         const company = item.Company ? item.Company : "N/A";
//         const previousFunding = item.PreviousFunding
//           ? item.PreviousFunding
//           : "N/A";
//         const thumbnailUrl = item.ThumbnailUrl
//           ? item.ThumbnailUrl.Url
//           : "N/A";

//         html += `
//         <div class="tile">
//           <img src="${thumbnailUrl}" alt="thumbnail" class="tile-image" />
//           <div class="tile-content">
//             <div class="tile-title">${item.Title}</div>
//             <div class="tile-info"><strong>Country:</strong> ${country}</div>
//             <div class="tile-info"><strong>Industry:</strong> ${industry}</div>
//             <div class="tile-info"><strong>Company:</strong> ${company}</div>
//             <div class="tile-info"><strong>Previous Funding:</strong> ${previousFunding}</div>
//             <button class="shortlist-button" onClick={() => this.addToShortlist(item.ID, company, this.getCurrentDate())}>Select</button>
//           </div>
//         </div>`;
//       });

//       html += `</div>`;
//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;
//       } else {
//         console.error("Element with id 'allItems' not found.");
//       }
//     } else {
//       this.undoRead();
//       alert(`No items found.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };

// private getAllItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding"
//       )();

//     if (items.length > 0) {
//       var html = `
//   <table>
//     <tr>
//       <th>Title</th>
//       <th>Country</th>
//       <th>Industry</th>
//       <th>Company</th>
//       <th>Previous Funding</th>
//       <th>Action</th>
//     </tr>`;

//       items.map((item, index) => {
//         const country = item.Country ? item.Country : "N/A";
//         const industry = item.Industry ? item.Industry : "N/A";
//         const company = item.Company ? item.Company : "N/A";
//         const previousFunding = item.PreviousFunding
//           ? item.PreviousFunding
//           : "N/A";

//         html += `
//     <tr>
//       <td>${item.Title}</td>
//       <td>${country}</td>
//       <td>${industry}</td>
//       <td>${company}</td>
//       <td>${previousFunding}</td>
//       <td><button class="shortlist-button" data-id="${item.ID}" data-company="${item.Company}">Shortlist</button></td>
//     </tr>`;
//       });

//       html += `</table>`;

//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;

//       } else {
//         console.error("Element with id 'allItems' not found.");
//       }
//     } else {
//       this.undoRead();
//       alert(`No items found.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };
// private addToShortlist = async (
//   id: string,
//   company: string,
//   date: string
// ) => {
//   // Update the state with the new shortlisted item
//   this.setState((prevState) => ({
//     shortlistedItems: [...prevState.shortlistedItems, { id, company, date }],
//   }));

//   try {
//     // Add the item to the SharePoint list
//     await this._sp.web.lists.getByTitle("Shortlisted").items.add({
//       Title: id,
//       Company: company,
//       Date: date,
//     });
//     console.log("Item added to SharePoint list.");
//   } catch (error) {
//     console.error("Error adding item to SharePoint list:", error);
//   }
// };

// @ts-ignore
// Method to handle investing in an item
// private investInItem = async (id: string) => {
//   try {
//     const itemId = parseInt(id, 10); // Convert id from string to number
//     const shortlistedList = this._sp.web.lists.getByTitle("Shortlisted");
//     const investmentsList = this._sp.web.lists.getByTitle("Investments");

//     // Get the item details from the Shortlisted list
//     const item = await shortlistedList.items
//       .getById(itemId)
//       .select("Title", "Company")();

//     // Add the item to the Investments list
//     await investmentsList.items.add({
//       Title: item.Title,
//       Company: item.Company,
//     });

//     console.log(`Item with ID ${id} invested and added to Investments list.`);

//     // Optionally, you can also remove the item from the Shortlisted list
//     await shortlistedList.items.getById(itemId).delete();
//     console.log(`Item with ID ${id} removed from Shortlisted list.`);

//     // Update the displayed list of shortlisted items
//     this.getShortlistedItems();
//   } catch (error) {
//     console.error(`Error investing in item with ID ${id}:`, error);
//   }
// };

// private investInItem = async(
// id:string,
// company:string,
// ) =>{
// try{
// this.setState((prevState) => ({
// investedItems: [...prevState.investedItems, { id, company}],
// }));
// await this._sp.web.lists.getByTitle("Invested").items.add({
// Title: id,
// Company: company,
// });
// console.log("Item added to SharePoint list.");
// } catch (error) {
// console.error("Error adding item to SharePoint list:", error);
// this.setState((prevState) => ({
// investedItems: prevState.investedItems.filter(
// (item) => item.id !== id
// ),
// }));
// }
// };
// private investInItem = async (id: string) => {
//   try {
//     const itemId = parseInt(id, 10); // Convert id from string to number
//     const shortlistedList = this._sp.web.lists.getByTitle("Shortlisted");
//     const investmentsList = this._sp.web.lists.getByTitle("Investments");

//     // Get the item details from the Shortlisted list
//     const item = await shortlistedList.items
//       .getById(itemId)
//       .select("Title", "Company")();

//     // Add the item to the Investments list
//     await investmentsList.items.add({
//       Title: item.Title,
//       Company: item.Company,
//     });

//     console.log(`Item with ID ${id} invested and added to Investments list.`);

//     // Optionally, you can also remove the item from the Shortlisted list
//     await shortlistedList.items.getById(itemId).delete();
//     console.log(`Item with ID ${id} removed from Shortlisted list.`);

//     // Update the displayed list of shortlisted items
//     this.getShortlistedItems();
//   } catch (error) {
//     console.error(`Error investing in item with ID ${id}:`, error);
//   }
// };
// private getShortlistedItems = async () => {
//   try {
//     // Fetch items from the Shortlisted list
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("Shortlisted")
//       .items.select("Title", "Company", "Date")();

//     // Generate HTML for the table
//     let html = `
//       <table>
//         <tr>
//           <th>Title</th>
//           <th>Company</th>
//           <th>Date</th>
//         </tr>`;

//     items.forEach((item) => {
//       html += `
//         <tr>
//           <td>${item.Title}</td>
//           <td>${item.Company}</td>
//           <td>${item.Date}</td>
//         </tr>`;
//     });

//     html += `</table>`;

//     // Display the table inside the specified <div>
//     const allItemsElement = document.getElementById("allItems");
//     if (allItemsElement) {
//       allItemsElement.innerHTML = html;
//     } else {
//       console.error("Element with id 'allItems' not found.");
//     }
//   } catch (error) {
//     console.error("Error fetching shortlisted items:", error);
//     // Optionally, display an error message or handle the error in another way
//   }
// };
// New code
// private addToShortlist = async (
//   id: string,
//   company: string,
//   date: string,
//   MyItemUniq: string
// ) => {
//   try {
//     // Update the state with the new shortlisted item
//     this.setState((prevState) => ({
//       shortlistedItems: [
//         ...prevState.shortlistedItems,
//         { id, company, date, MyItemUniq },
//       ],
//     }));

//     // Add the item to the SharePoint list
//     await this._sp.web.lists.getByTitle("Shortlisted").items.add({
//       Title: id,
//       Company: company,
//       Date: date,
//       MyItemUniq: MyItemUniq,
//     });
//     console.log("Item added to SharePoint list.");
//   } catch (error) {
//     console.error("Error adding item to SharePoint list:", error);
//     // Rollback the state change if adding to SharePoint list fails
//     this.setState((prevState) => ({
//       shortlistedItems: prevState.shortlistedItems.filter(
//         (item) => item.id !== id
//       ),
//     }));
//   }
// };
// private getShortlistedItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("Shortlisted")
//       .items.select("Title", "Company", "Date")();

//     let html = `
//       <table>
//         <tr>
//           <th>Title</th>
//           <th>Company</th>
//           <th>Date</th>
//           <th>Action</th>
//         </tr>`;

//     items.forEach((item) => {
//       html += `
//         <tr>
//           <td>${item.Title}</td>
//           <td>${item.Title}</td>
//           <td>${item.Company}</td>
//           <td>${item.Date}</td>
//           <td>
//             <button class="delete-button" data-id="${item.ID}">Delete</button>
//             <button class="invest-button" data-id="${item.ID}">Invest</button>
//           </td>
//         </tr>`;
//     });

//     html += `</table>`;

//     const allItemsElement = document.getElementById("allItems");
//     if (allItemsElement) {
//       allItemsElement.innerHTML = html;

//       // Add event listeners to delete and invest buttons
//       document.querySelectorAll(".delete-button").forEach((button) => {
//         button.addEventListener("click", async (event) => {
//           const target = event.target as HTMLElement;
//           const id = target.dataset.id;
//           if (id) {
//             await this.deleteItemFromShortlist(id);
//             alert("Item Deleted?!");
//           } else {
//             console.error("Item ID is missing from button dataset.");
//           }
//         });
//       });

//       document.querySelectorAll(".invest-button").forEach((button) => {
//         button.addEventListener("click", (event) => {
//           const target = event.target as HTMLElement;
//           const id = target.dataset.id;
//           if (id) {
//             this.investInItem(id);
//             alert("Item Added to Investment");
//           } else {
//             console.error("Item ID is missing from button dataset.");
//           }
//         });
//       });
//     } else {
//       console.error("Element with id 'allItems' not found.");
//     }
//   } catch (error) {
//     console.error("Error fetching shortlisted items:", error);
//   }
// };
// private getShortlistedItems = async () => {
//   try {
//     // Fetch items from the Shortlisted list
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("Shortlisted")
//       .items.select("Title", "Company", "Date")();

//     // Generate HTML for the table
//     let html = `
//       <table>
//         <tr>
//           <th>Title</th>
//           <th>Company</th>
//           <th>Date</th>
//           <th>Action</th>
//         </tr>`;

//     items.forEach((item) => {
//       html += `
//         <tr>
//           <td>${item.Title}</td>
//           <td>${item.Company}</td>
//           <td>${item.Date}</td>
//           <td>
//             <button class="delete-button" data-id="${item.Title}">Delete</button>
//             <button class="invest-button" data-id="${item.Title}">Invest</button>
//           </td>
//         </tr>`;
//     });

//     html += `</table>`;

//     // Display the table inside the specified <div>
//     const allItemsElement = document.getElementById("allItems");
//     if (allItemsElement) {
//       allItemsElement.innerHTML = html;

//       // Add event listeners to delete and invest buttons
//       document.querySelectorAll(".delete-button").forEach((button) => {
//         button.addEventListener("click", (event) => {
//           const target = event.target as HTMLElement;
//           const id = target.dataset.id;
//           if (id) {
//             this.deleteItemFromShortlist(id);
//             alert("Item Deleted!");
//           } else {
//             console.error("Item ID is missing from button dataset.");
//           }
//         });
//       });

//       document.querySelectorAll(".invest-button").forEach((button) => {
//         button.addEventListener("click", (event) => {
//           const target = event.target as HTMLElement;
//           const id = target.dataset.id;
//           if (id) {
//             this.investInItem(id);
//             alert("Item Added to Investment");
//           } else {
//             console.error("Item ID is missing from button dataset.");
//           }
//         });
//       });
//     } else {
//       console.error("Element with id 'allItems' not found.");
//     }
//   } catch (error) {
//     console.error("Error fetching shortlisted items:", error);
//     // Optionally, display an error message or handle the error in another way
//   }
// };

// Method to delete an item from the shortlisted list
// private deleteItemFromShortlist = async (id: string) => {
//   // try {
//   //   const itemId = parseInt(id, 10); // Convert id from string to number
//   //   const list = this._sp.web.lists.getByTitle("Shortlisted");

//   //   // Check if the item exists
//   //   const itemExists = await list.items.getById(itemId).select("ID")();
//   //   if (!itemExists) {
//   //     console.log(
//   //       `Item with ID ${id} does not exist in the Shortlisted list.`
//   //     );
//   //     return;
//   //   }

//   //   // Delete the item
//   //   await list.items.getById(itemId).delete();
//   //   console.log(`Item with ID ${id} deleted from Shortlisted list.`);

//   //   // Wait for a short delay to allow for server synchronization
//   //   await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms = 1 second

//   //   // Update the displayed list of shortlisted items
//   //   this.getShortlistedItems();
//   // } catch (error) {
//   //   console.error(
//   //     `Error deleting item with ID ${id} from Shortlisted list:`,
//   //     error
//   //   );
//   // }
//   console.log(`Deleting item with ID ${id}`);
// };

// New code for deleting item from shortlisted list
// private deleteItemFromShortlist = async (id: string) => {
//   try {
//     const itemId = parseInt(id, 10); // Convert id from string to number
//     const list = this._sp.web.lists.getByTitle("Shortlisted");

//     // Check if the item exists
//     const itemExists = await list.items.getById(itemId).select("ID")();
//     if (!itemExists) {
//       console.log(
//         `Item with ID ${id} does not exist in the Shortlisted list.`
//       );
//       return;
//     }

//     // Delete the item
//     await list.items.getById(itemId).delete();
//     console.log(`Item with ID ${id} deleted from Shortlisted list.`);

//     // Wait for a short delay to allow for server synchronization
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms = 1 second

//     // Update the displayed list of shortlisted items
//     this.getShortlistedItems();
//   } catch (error) {
//     console.error(
//       `Error deleting item with ID ${id} from Shortlisted list:`,
//       error
//     );
//   }
// };

// private deleteItemFromShortlist = async (id: string) => {
//   try {
//     // Convert the id to a number
//     const itemId = parseInt(id, 10);

//     // Delete the item from the "Shortlisted" list
//     await this._sp.web.lists
//       .getByTitle("Shortlisted")
//       .items.getById(itemId)
//       .delete();
//     console.log(`Item with ID: ${id} deleted from Shortlisted list.`);
//     await this.getShortlistedItems();
//   } catch (error) {
//     console.error(`Error deleting item with ID: ${id}`, error);
//   }
// };

// private deleteItemFromShortlist = async (id: string) => {
//   try {
//     const itemId = parseInt(id, 10); // Convert id from string to number
//     if (isNaN(itemId)) {
//       throw new Error(`Invalid id: ${id}`);
//     }

//     const list = this._sp.web.lists.getByTitle("Shortlisted");

//     // Check if the item exists
//     const itemExists = await list.items.getById(itemId).select("ID")();
//     if (!itemExists) {
//       console.log(
//         `Item with ID ${id} does not exist in the Shortlisted list.`
//       );
//       return;
//     }

//     // Delete the item
//     await list.items.getById(itemId).delete();
//     console.log(`Item with ID ${id} deleted from Shortlisted list.`);

//     // Wait for a short delay to allow for server synchronization
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms = 1 second

//     // Update the displayed list of shortlisted items
//     this.getShortlistedItems();
//   } catch (error) {
//     console.error(
//       `Error deleting item with ID ${id} from Shortlisted list:`,
//       error
//     );
//   }
// };

// private getAllItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding",
//         "companyPage"
//       )();

//     if (items.length > 0) {
//       var html = `
//         <table>
//           <tr>
//             <th>Title</th>
//             <th>Country</th>
//             <th>Industry</th>
//             <th>Company</th>
//             <th>Previous Funding</th>
//             <th>Link</th>
//             <th>Action</th>
//           </tr>`;

//       items.map((item, index) => {
//         const country = item.Country ? item.Country : "N/A";
//         const industry = item.Industry ? item.Industry : "N/A";
//         const company = item.Company ? item.Company : "N/A";
//         const previousFunding = item.PreviousFunding
//           ? item.PreviousFunding
//           : "N/A";
//         const companyPageUrl = item.companyPage ? item.companyPage.Url : "#";

//         html += `
//           <tr>
//             <td>${item.Title}</td>
//             <td>${country}</td>
//             <td>${industry}</td>
//             <td>${company}</td>
//             <td>${previousFunding}</td>
//             <td><a href="${companyPageUrl}" target="_blank">Visit</a></td>

//             <td>
//             <button class="shortlist-button" data-id="${item.ID}" data-company="${item.Company}">Select</button>
//           </td>
//           </tr>`;
//       });

//       html += `</table>`;

//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;

//         // Add event listener to buttons
//         document.querySelectorAll(".shortlist-button").forEach((button) => {
//           button.addEventListener("click", (event) => {
//             const target = event.target as HTMLElement;
//             const id = target.dataset.id;
//             const company = target.dataset.company;
//             const date = this.getCurrentDate();
//             // const sp = spfi(...);
//             // const user = await sp.web.currentUser();

//             const user = this._sp.web.currentUser;

//             const loginname = user.select("LoginName")();

//             console.log("Login name of the current user:", loginname);

//             const MyItemUniq = `${loginname}${this.getCurrentDate()}${id}${company}`;
//             if (id && company) {
//               this.addToShortlist(id, company, date, MyItemUniq);
//             } else {
//               console.error("ID or company is missing from button dataset.");
//             }
//           });
//         });
//       } else {
//         console.error("Element with id 'allItems' not found.");
//       }
//     } else {
//       this.undoRead();
//       alert(`No items found.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };

// private addToShortlist = async (
//   id: string,
//   company: string,
//   date: string,
//   MyItemUniq: string
// ) => {
//   try {
//     // Update the state with the new shortlisted item
//     this.setState((prevState) => ({
//       shortlistedItems: [
//         ...prevState.shortlistedItems,
//         { id, company, date, MyItemUniq },
//       ],
//     }));

//     // Add the item to the SharePoint list
//     await this._sp.web.lists.getByTitle("Shortlisted").items.add({
//       Title: id,
//       Company: company,
//       Date: date,
//       MyItemUniq: MyItemUniq,
//     });
//     console.log("Item added to SharePoint list.");
//   } catch (error) {
//     console.error("Error adding item to SharePoint list:", error);
//     // Rollback the state change if adding to SharePoint list fails
//     this.setState((prevState) => ({
//       shortlistedItems: prevState.shortlistedItems.filter(
//         (item) => item.id !== id
//       ),
//     }));
//   }
// };
// private getAllItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding",
//         "companyPage"
//       )();

//     if (items.length > 0) {
//       var html = `
//         <table>
//           <tr>
//             <th>Title</th>
//             <th>Country</th>
//             <th>Industry</th>
//             <th>Company</th>
//             <th>Previous Funding</th>
//             <th>Link</th>
//             <th>Action</th>
//           </tr>`;

//       items.forEach((item, index) => {
//         const country = item.Country ? item.Country : "N/A";
//         const industry = item.Industry ? item.Industry : "N/A";
//         const company = item.Company ? item.Company : "N/A";
//         const previousFunding = item.PreviousFunding
//           ? item.PreviousFunding
//           : "N/A";
//         const companyPageUrl = item.companyPage ? item.companyPage.Url : "#";

//         html += `
//           <tr>
//             <td>${item.Title}</td>
//             <td>${country}</td>
//             <td>${industry}</td>
//             <td>${company}</td>
//             <td>${previousFunding}</td>
//             <td><a href="${companyPageUrl}" target="_blank">Visit</a></td>

//             <td>
//               <button class="shortlist-button" data-id="${item.ID}" data-company="${item.Company}">Select</button>
//             </td>
//           </tr>`;
//       });

//       html += `</table>`;

//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;

//         // Add event listener to buttons
//         document.querySelectorAll(".shortlist-button").forEach((button) => {
//           button.addEventListener("click", (event) => {
//             const target = event.target as HTMLElement;
//             const id = target.dataset.id;
//             const company = target.dataset.company;
//             const date = this.getCurrentDate();
//             const user = this._sp.web.currentUser;

//             const loginname = user.select("LoginName")();

//             console.log("Login name of the current user:", loginname);

//             const MyItemUniq = `${loginname}${this.getCurrentDate()}${id}${company}`;
//             if (id && company) {
//               this.addToShortlist(id, company, date, MyItemUniq);
//             } else {
//               console.error("ID or company is missing from button dataset.");
//             }
//           });
//         });
//       } else {
//         console.error("Element with id 'allItems' not found.");
//       }
//     } else {
//       this.undoRead();
//       alert(`No items found.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };

//Working seed
// private getAllItems = async () => {
//   try {
//     const items: any[] = await this._sp.web.lists
//       .getByTitle("DisplayList")
//       .items.select(
//         "ID",
//         "Title",
//         "Country",
//         "Industry",
//         "Company",
//         "ThumbnailUrl",
//         "PreviousFunding",
//         "companyPage",
//         "SeedInvestment"
//       )();

//     const filteredItems = items.filter((item) => item.SeedInvestment);

//     if (filteredItems.length > 0) {
//       var html = `
//         <table>
//           <tr>
//             <th>Title</th>
//             <th>Country</th>
//             <th>Industry</th>
//             <th>Company</th>
//             <th>Previous Funding</th>
//             <th>Link</th>
//             <th>Action</th>
//           </tr>`;

//       filteredItems.forEach((item, index) => {
//         const country = item.Country ? item.Country : "N/A";
//         const industry = item.Industry ? item.Industry : "N/A";
//         const company = item.Company ? item.Company : "N/A";
//         const previousFunding = item.PreviousFunding
//           ? item.PreviousFunding
//           : "N/A";
//         const companyPageUrl = item.companyPage ? item.companyPage.Url : "#";

//         html += `
//           <tr>
//             <td>${item.Title}</td>
//             <td>${country}</td>
//             <td>${industry}</td>
//             <td>${company}</td>
//             <td>${previousFunding}</td>
//             <td><a href="${companyPageUrl}" target="_blank">Visit</a></td>
//             <td>
//               <button class="shortlist-button" data-id="${item.ID}" data-company="${item.Company}">Select</button>
//             </td>
//           </tr>`;
//       });

//       html += `</table>`;

//       const allItemsElement = document.getElementById("allItems");
//       if (allItemsElement) {
//         allItemsElement.innerHTML = html;

//         // Add event listener to buttons
//         document.querySelectorAll(".shortlist-button").forEach((button) => {
//           button.addEventListener("click", (event) => {
//             const target = event.target as HTMLElement;
//             const id = target.dataset.id;
//             const company = target.dataset.company;
//             const date = this.getCurrentDate();
//             const user = this._sp.web.currentUser;

//             const loginname = user.select("LoginName")();

//             console.log("Login name of the current user:", loginname);

//             const MyItemUniq = `${loginname}${this.getCurrentDate()}${id}${company}`;
//             if (id && company) {
//               this.addToShortlist(id, company, date, MyItemUniq);
//             } else {
//               console.error("ID or company is missing from button dataset.");
//             }
//           });
//         });
//       } else {
//         console.error("Element with id 'allItems' not found.");
//       }
//     } else {
//       this.undoRead();
//       alert(`No items found.`);
//     }
//   } catch (e) {
//     console.error(e);
//     alert("An error occurred while fetching items.");
//   }
// };
// private async fetchIndustriesFromSharePointList(selectedCountry: string) {
//   try {
//     const industries: any[] = await this._sp.web.lists
//       .getByTitle("IndustryType")
//       .items.filter(`Country eq '${selectedCountry}'`)
//       .select("ID", "Title")();
//     this.setState({ industries });
//   } catch (e) {
//     console.error(e);
//   }
// }
// private handleFundingInfoChange = (
//   event: React.ChangeEvent<HTMLSelectElement>
// ) => {
//   const selectedFundingInfo = event.target.value;
//   this.setState({ selectedFundingInfo });
// };

// private async fetchCompanyFromSharePointList(selectedIndustry: string) {
//   try {
//     const companies: any[] = await this._sp.web.lists
//       .getByTitle("CompanyInfo")
//       .items.filter(`IndustryType eq '${selectedIndustry}'`)
//       .select("ID", "Title")();
//     this.setState({ companies });
//   } catch (e) {
//     console.error(e);
//   }
// }
// private async fetchCompanyFromSharePointList() {
//   try {
//     const companies: any[] = await this._sp.web.lists
//       .getByTitle("CompanyInfo")
//       .items.select("ID", "Title")();
//     this.setState({ companies });
//   } catch (e) {
//     console.error(e);
//   }
// }
