//Main Code
import * as React from "react";
import styles from "./FilterAndSearch.module.scss";
import type { IFilterAndSearchProps } from "./IFilterAndSearchProps";
import { getSP } from "./Spfx_sp.config";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

interface IFilterAndSearchState {
  countries: any[];
  industries: any[];
  companies: any[];
  fundingInfos: any[];
  selectedCountry: string;
  selectedIndustry: string;
  selectedCompany: string;
  selectedFundingInfo: string;
  items: any[];
  shortlistedItems: { id: string; company: string; date: string }[];
  investedItems: { id: string; company: string }[];
  SeedInvestment: boolean;
  selectedInvestment: string;
}

export default class FilterAndSearch extends React.Component<
  IFilterAndSearchProps,
  IFilterAndSearchState
> {
  private _sp: SPFI;

  constructor(props: IFilterAndSearchProps) {
    super(props);
    this.state = {
      countries: [],
      industries: [],
      fundingInfos: [],
      selectedCountry: "",
      selectedIndustry: "",
      selectedCompany: "",
      selectedFundingInfo: "",
      items: [],
      companies: [],
      shortlistedItems: [],
      investedItems: [],
      SeedInvestment: false,
      selectedInvestment: "",
    };
    this._sp = getSP();
  }
  public componentDidMount() {
    this.getAllItems();
    this.fetchCountriesFromSharePointList();
    this.fetchIndustriesFromSharePointList();
    this.fetchCompanyFromSharePointList();
    this.fetchFundingInfosFromSharePointList();
  }
  private getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  public render(): React.ReactElement<IFilterAndSearchProps> {
    return (
      <div className={styles.spfxCrudPnp}>
        <div className={styles.row}>
          <div className={styles.column}>
            {/* Filter Component */}
            <div className="filter">
              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Country</div>
                <select
                  value={this.state.selectedCountry}
                  onChange={this.handleCountryChange}
                >
                  <option value="">Select Country</option>
                  {this.state.countries.map((Country) => (
                    <option key={Country.ID} value={Country.Title}>
                      {Country.Title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Industry</div>

                <select
                  value={this.state.selectedIndustry}
                  onChange={this.handleIndustryChange}
                >
                  <option value="">Select Industry</option>
                  {this.state.industries.map((industry) => (
                    <option key={industry.ID} value={industry.Title}>
                      {industry.Title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Company</div>

                <select
                  value={this.state.selectedCompany}
                  onChange={this.handleCompanyChange}
                >
                  <option value="">Select Company</option>
                  {this.state.companies.map((Company) => (
                    <option key={Company.ID} value={Company.Title}>
                      {Company.Title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.itemField}>
                <label>
                  <input
                    type="checkbox"
                    checked={this.state.SeedInvestment}
                    onChange={this.handleSeedInvestments}
                  />
                  Include Seed Investments
                </label>
              </div>

              <div className={styles.itemField}>
                <div className={styles.fieldLabel}>Investments</div>
                <select
                  value={this.state.selectedInvestment}
                  onChange={this.handleInvestmentChange}
                >
                  <option value="">Select Amount</option>
                  <option value="$">Less Than 100k</option>
                  <option value="$$">Between 100k and 200k</option>
                  <option value="$$$">More than 200k</option>
                </select>
              </div>
            </div>
            {/* Buttons */}
            <div className="buttons">
              <div className={styles.buttonSection}>
                <div className={styles.button}>
                  <span
                    className={styles.fieldLabel}
                    onClick={this.getAllItems}
                  >
                    Search
                  </span>
                </div>
                {/* <div className={styles.button}>
                  <span className={styles.fieldLabel} onClick={this.undoRead}>
                    Undo Read
                  </span>
                </div> */}

                <div className={styles.button}>
                  <span
                    className={styles.fieldLabel}
                    onClick={this.getShortlistedItems}
                  >
                    My List
                  </span>
                </div>
              </div>
            </div>
            {/* Results
              <div className="results">
                <div className={styles.itemField}>
                  <div className={styles.fieldLabel}>All Items:</div>
                  <div id="allItems"></div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    );
  }

  private deleteItemFromShortlist = async (id: string) => {
    try {
      // Convert the id to a number
      const itemId = parseInt(id, 10);

      // Delete the item from the "Shortlisted" list
      await this._sp.web.lists
        .getByTitle("Shortlisted")
        .items.getById(itemId)
        .delete();
      console.log(`Item with ID: ${id} deleted from Shortlisted list.`);
      await this.getShortlistedItems();
    } catch (error) {
      console.error(`Error deleting item with ID: ${id}`, error);
    }
  };

  private investInItem = async (id: string) => {
    try {
      // Convert the id to a number
      const itemId = parseInt(id, 10);

      // Get the item from the "Shortlisted" list
      const item = await this._sp.web.lists
        .getByTitle("Shortlisted")
        .items.getById(itemId)();

      // Add the item to the "Investments"
      await this._sp.web.lists.getByTitle("Investments").items.add({
        Title: item.ID.toString(),
        Company: item.Company,
        username: item.username,
        EmailID: item.EmailID,
      });
      console.log(`Item with ID: ${id} added to Investments.`);
    } catch (error) {
      console.error(`Error applying item with ID: ${id}`, error);
    }
  };

  private undoRead = () => {
    this.setState({ items: [] });
    const allItemsElement = document.getElementById("allItems");
    if (allItemsElement) {
      allItemsElement.innerHTML = "";
    } else {
      console.error("Element with id 'All Items' not found.");
    }
  };

  // Working Add to Shortlist

  // @ts-ignore
  private addToShortlist = async (
    id: string,
    company: string,
    date: string,
    MyItemUniq: string
  ) => {
    try {
      const user = await this._sp.web.currentUser();
      const loginName = user.Title;

      const emailId = user.Email;

      const date = this.getCurrentDate();

      const MyItemUniq = `${loginName}${date}${id}${company}`;

      await this._sp.web.lists.getByTitle("Shortlisted").items.add({
        Title: `Shortlisted ${id}`,
        Company: company,
        Date: date,
        MyItemUniq: MyItemUniq,
        username: user.Title,
        EmailID: emailId,
      });

      alert("company Shortlisted!");
    } catch (error) {
      console.error("Error shortlisting company:", error);
      alert("An error occurred while shortlisting the company.");
    }
  };

  // private getAllItems = async () => {
  //   try {
  //     const { selectedCountry, selectedIndustry, selectedCompany } = this.state;

  //     let filterQuery = "";

  //     if (selectedCountry) {
  //       filterQuery += `Country eq '${selectedCountry}'`;
  //     }

  //     if (selectedIndustry) {
  //       if (filterQuery) filterQuery += " and ";
  //       filterQuery += `Industry eq '${selectedIndustry}'`;
  //     }

  //     if (selectedCompany) {
  //       if (filterQuery) filterQuery += " and ";
  //       filterQuery += `Company eq '${selectedCompany}'`;
  //     }

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
  //         "SeedInvestment",
  //         "Investments"
  //       )
  //       .filter(filterQuery)();

  //     let filteredItems = items;
  //     if (this.state.SeedInvestment) {
  //       filteredItems = items.filter((item) => item.SeedInvestment);
  //     }

  //     // Filter based on selected investment amount
  //     if (this.state.selectedInvestment) {
  //       filteredItems = filteredItems.filter(
  //         (item) => item.Investments === this.state.selectedInvestment
  //       );
  //     }

  //     if (filteredItems.length > 0) {
  //       var html = `<style>
  //       .tile-image-container {
  //         width: 200px; /* Set a fixed width */
  //         height: 50px; /* Set a fixed height */
  //         overflow: hidden; /* Hide anything that goes outside the box */
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;
  //         margin-bottom: 10px;
  //       }

  //       .tile a {
  //         text-decoration: none;
  //         color: #333; /* Change this to your preferred color */
  //       }
  //       .tile a:hover {
  //         color: #666; /* Change this to your preferred hover color */
  //       }
  //       .tile-title, .tile-country, .tile-industry, .tile-company, .tile-previous-funding {
  //         font-size: 1em;
  //         color: #333; /* Change this to your preferred color */
  //       }
  //       .shortlist-button {
  //         color: #fff; /* Change this to your preferred color */
  //       }
  //       .tile-content {
  //         display: flex;
  //         flex-direction: column;
  //         justify-content: space-between;
  //         height: 100%;
  //         padding: 10px;
  //         text-align: left;
  //       }
  //       .tile-top {
  //         display: flex;
  //         flex-direction: column;
  //       }
  //       .tile-bottom {
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;
  //         margin-top: auto;
  //       }
  //       .tiles {
  //         display: grid;
  //         grid-template-columns: repeat(3, 1fr);
  //         gap: 20px;
  //         padding: 20px;
  //         box-sizing: border-box;
  //       }
  //       .tile {
  //         position: relative;
  //         border: 1px solid #ddd;
  //         border-radius: 10px;
  //         padding: 20px;
  //         box-sizing: border-box;
  //         text-align: center;
  //         transition: transform 0.3s ease-in-out;
  //       }
  //       .tile:hover {
  //         transform: scale(1.05);
  //       }
  //       .tile-image {
  //         max-width: 100%; /* Ensure the image doesn't go outside the box */
  //         max-height: 100%;
  //         border-radius: 10px;
  //         cursor: pointer;
  //         object-fit: cover;
  //       }
  //       .tile-title {
  //         font-weight: bold;
  //         margin-top: 10px;
  //         font-size: 1.5em;
  //       }
  //       .tile-country, .tile-industry, .tile-company, .tile-previous-funding {
  //         margin-top: 10px;
  //         font-size: 0.9em;
  //       }
  //       .shortlist-button {
  //         background-color: #0078d4;
  //         color: #fff;
  //         border: none;
  //         border-radius: 5px;
  //         padding: 10px 20px;
  //         cursor: pointer;
  //         margin-top: 10px;
  //         transition: background-color 0.3s ease-in-out;
  //       }
  //       .shortlist-button:hover {
  //         background-color: #005a9e;
  //       }
  //     </style>
  //       <div class="tiles">`;

  //       filteredItems.forEach((item, index) => {
  //         const country = item.Country ? item.Country : "N/A";
  //         const industry = item.Industry ? item.Industry : "N/A";
  //         const company = item.Company ? item.Company : "N/A";
  //         const previousFunding = item.PreviousFunding
  //           ? item.PreviousFunding
  //           : "N/A";
  //         const companyPageUrl = item.companyPage ? item.companyPage.Url : "#";
  //         const imageUrl = item.ThumbnailUrl ? item.ThumbnailUrl.Url : "";

  //         html += `
  //         <div class="tile">
  //         <div class="tile-content">
  //           <div class="tile-top">
  //             <a href="${companyPageUrl}" target="_blank" rel="noopener noreferrer">

  //             <div class="tile-image-container">
  //               <img src="${imageUrl}" alt="Thumbnail" class="tile-image" />
  //               </div>
  //               <div class="tile-title">${item.Title}</div>
  //               <div class="tile-country">Country: ${country}</div>
  //               <div class="tile-industry">Industry: ${industry}</div>
  //               <div class="tile-company">Company: ${company}</div>
  //               <div class="tile-previous-funding">Previous Funding: ${previousFunding}</div>
  //             </a>
  //           </div>
  //           <div class="tile-bottom">
  //             <button class="shortlist-button" data-id="${item.ID}" data-company="${item.Company}">Shortlist</button>
  //           </div>
  //         </div>
  //       </div>
  //       `;
  //       });

  //       html += `</div>`;

  //       const allItemsElement = document.getElementById("allItems");
  //       if (allItemsElement) {
  //         allItemsElement.innerHTML = html;

  //         // Add event listener to buttons...
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

  // Working Filter + Tile View
  private getAllItems = async () => {
    try {
      const { selectedCountry, selectedIndustry, selectedCompany } = this.state;

      let filterQuery = "";

      if (selectedCountry) {
        filterQuery += `Country eq '${selectedCountry}'`;
      }

      if (selectedIndustry) {
        if (filterQuery) filterQuery += " and ";
        filterQuery += `Industry eq '${selectedIndustry}'`;
      }

      if (selectedCompany) {
        if (filterQuery) filterQuery += " and ";
        filterQuery += `Company eq '${selectedCompany}'`;
      }

      const items: any[] = await this._sp.web.lists
        .getByTitle("DisplayList")
        .items.select(
          "ID",
          "Title",
          "Country",
          "Industry",
          "Company",
          "ThumbnailUrl",
          "PreviousFunding",
          "companyPage",
          "SeedInvestment",
          "Investments",
          "CompanyWebsite"
        )
        .filter(filterQuery)();

      let filteredItems = items;
      if (this.state.SeedInvestment) {
        filteredItems = items.filter((item) => item.SeedInvestment);
      }

      // Filter based on selected investment amount
      if (this.state.selectedInvestment) {
        filteredItems = filteredItems.filter(
          (item) => item.Investments === this.state.selectedInvestment
        );
      }

      if (filteredItems.length > 0) {
        var html = `<style>
      .tile-image-container {
        width: 150px; /* Set a fixed width */
        height: 40px; /* Set a fixed height */
        overflow: hidden; /* Hide anything that goes outside the box */
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
      }
     
      .tile a {
        text-decoration: none;
        color: #333; /* Change this to your preferred color */
      }
      .tile a:hover {
        color: #666; /* Change this to your preferred hover color */
      }
      .tile-title, .tile-country, .tile-industry, .tile-company, .tile-previous-funding {
        font-size: 1em;
        color: #333; /* Change this to your preferred color */
      }
      .shortlist-button, .company-page-button, .company-website-button {
        background-color: #0078d4;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 5px 10px; /* Adjust padding to reduce the size of the button */
        font-size: 0.8em; /* Adjust font size to make text smaller */
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.3s ease-in-out;
      }
      
      .shortlist-button:hover, .company-page-button:hover, .company-website-button:hover {
        background-color: #005a9e;
      }
      
      .tile-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 10px;
        text-align: left;
      }
      .tile-top {
        display: flex;
        flex-direction: column;
      }
      .tile-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: auto;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 20px;
        box-sizing: border-box;
      }
      .tile {
        position: relative; 
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 15px;
        box-sizing: border-box;
        text-align: center;
        transition: transform 0.3s ease-in-out;
        width: 180px; /* Set a fixed width */
        height: auto; /* Let the height adjust automatically */
      }
      .tile:hover {
        transform: scale(1.05);
      }
      .tile-image {
        max-width: 100%; /* Ensure the image doesn't go outside the box */
        max-height: 100%;
        border-radius: 10px;
        cursor: pointer;
        object-fit: cover;
      }
      .tile-title {
        font-weight: bold;
        margin-top: 10px;
        font-size: 1.5em;
      }
      .tile-country, .tile-industry, .tile-company, .tile-previous-funding {
        margin-top: 10px;
        font-size: 0.9em;
      }
      .shortlist-button {
        background-color: #0078d4;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.3s ease-in-out;
      }
      .shortlist-button:hover {
        background-color: #005a9e;
      }
      .button-container {
        display: flex;
        justify-content: space-between; /* Adjusts the space between the buttons */
      }
    </style>
      <div class="tiles">`;

        filteredItems.forEach((item, index) => {
          const country = item.Country ? item.Country : "N/A";
          const industry = item.Industry ? item.Industry : "N/A";
          const company = item.Company ? item.Company : "N/A";
          const previousFunding = item.PreviousFunding
            ? item.PreviousFunding
            : "N/A";
          const companyPageUrl = item.companyPage ? item.companyPage.Url : "#";
          const CompanyWebsiteUrl = item.CompanyWebsite
            ? item.CompanyWebsite.Url
            : "#";
          const imageUrl = item.ThumbnailUrl ? item.ThumbnailUrl.Url : "";

          html += `
        <div class="tile">
          <div class="tile-content">
            <div class="tile-top">
              
                <div class="tile-image-container">
                  <img src="${imageUrl}" alt="Thumbnail" class="tile-image" />
                </div>
                <div class="tile-title">${item.Title}</div>
                <div class="tile-country">Country: ${country}</div>
                <div class="tile-industry">Industry: ${industry}</div>
                <div class="tile-company">Company: ${company}</div>
                <div class="tile-previous-funding">Previous Funding: ${previousFunding}</div>
             
            </div>
            <div class="tile-bottom">
              <button class="shortlist-button" data-id="${item.ID}" data-company="${item.Company}">Shortlist</button>
              </div>
              <div class="button-container">
  <button class="company-page-button" data-url="${companyPageUrl}">More Details:</button>
  <button class="company-website-button" data-url="${CompanyWebsiteUrl}">Company Website:</button>
</div>
              </div>
        </div>
        `;
        });
        html += `</div>`;

        const allItemsElement = document.getElementById("allItems");
        if (allItemsElement) {
          allItemsElement.innerHTML = html;

          // Add event listener to buttons...
          document
            .querySelectorAll(
              ".shortlist-button, .company-page-button, .company-website-button"
            )
            .forEach((button) => {
              button.addEventListener("click", (event) => {
                const target = event.target as HTMLElement;
                const id = target.dataset.id;
                const company = target.dataset.company;
                const url = target.dataset.url;

                if (target.classList.contains("shortlist-button")) {
                  const date = this.getCurrentDate();
                  const user = this._sp.web.currentUser;
                  const loginname = user.select("LoginName")();
                  console.log("Login name of the current user:", loginname);
                  const MyItemUniq = `${loginname}${this.getCurrentDate()}${id}${company}`;
                  if (id && company) {
                    this.addToShortlist(id, company, date, MyItemUniq);
                  } else {
                    console.error(
                      "ID or company is missing from button dataset."
                    );
                  }
                } else if (
                  target.classList.contains("company-page-button") ||
                  target.classList.contains("company-website-button")
                ) {
                  if (url) {
                    window.open(url, "_blank");
                  } else {
                    console.error("URL is missing from button dataset.");
                  }
                }
              });
            });
        } else {
          console.error("Element with id 'allItems' not found.");
        }
      } else {
        this.undoRead();
        alert(`No items found.`);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while fetching items.");
    }
  };

  //   private getShortlistedItems = async () => {
  //     try {
  //       // Fetch items from the Shortlisted list
  //       const items: any[] = await this._sp.web.lists
  //         .getByTitle("Shortlisted")
  //         .items.select("ID", "Title", "Company", "username", "EmailID")(); // Include the "ID" field

  //       // Get the current user's title (assuming you have access to it)
  //       const user = await this._sp.web.currentUser();
  //       const currentUserTitle = user.Title; // Replace with the actual current user's title

  //       // Generate HTML for the table
  //       let html = `
  // <table>
  // <tr>
  //   <th>Title</th>
  //   <th>Company</th>
  //   <th>Action</th>
  // </tr>`;

  //       items.forEach((item) => {
  //         // Check if the item's Username matches the current user's title
  //         if (item.username === currentUserTitle) {
  //           html += `
  // <tr>
  //   <td>${item.Title}</td>
  //   <td>${item.Company}</td>
  //   <td>
  //     <button class="delete-button" data-id="${item.ID}">Delete</button>
  //     <button class="apply-button" data-id="${item.ID}">Apply</button>
  //   </td>
  // </tr>`;
  //         }
  //       });

  //       html += `</table>`;

  //       // Display the table inside the specified <div>
  //       const allItemsElement = document.getElementById("allItems");
  //       if (allItemsElement) {
  //         allItemsElement.innerHTML = html;

  //         // Add event listeners to delete and apply buttons
  //         document.querySelectorAll(".delete-button").forEach((button) => {
  //           button.addEventListener("click", async (event) => {
  //             const target = event.target as HTMLElement;
  //             const id = target.dataset.id;
  //             if (id) {
  //               await this.deleteItemFromShortlist(id);
  //               alert("Item Deleted!");
  //             } else {
  //               console.error("ID is missing or undefined from button dataset.");
  //             }
  //           });
  //         });

  //         document.querySelectorAll(".apply-button").forEach((button) => {
  //           button.addEventListener("click", async (event) => {
  //             const target = event.target as HTMLElement;
  //             const id = target.dataset.id;
  //             if (id) {
  //               await this.investInItem(id);
  //               alert("Item Applied!");
  //             } else {
  //               console.error("ID is missing or undefined from button dataset.");
  //             }
  //           });
  //         });
  //       } else {
  //         console.error("Element with id 'allItems' not found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching shortlisted items:", error);
  //       // Optionally, display an error message or handle the error in another way
  //     }
  //   };
  private getShortlistedItems = async () => {
    try {
      // Fetch items from the Shortlisted list
      const items: any[] = await this._sp.web.lists
        .getByTitle("Shortlisted")
        .items.select("ID", "Title", "Company", "username", "EmailID")(); // Include the "ID" field

      // Get the current user's title (assuming you have access to it)
      const user = await this._sp.web.currentUser();
      const currentUserTitle = user.Title; // Replace with the actual current user's title

      // Generate HTML for the table
      let html = `
<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #0078d4;
    color: white;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  .delete-button, .apply-button {
    margin-right: 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .delete-button {
    background-color: #f44336;
    color: white;
  }
  .apply-button {
    background-color: #0078d4;
    color: white;
  }
</style>
<table>
<tr>
  <th>Title</th>
  <th>Company</th>
  <th>Action</th>
</tr>`;

      items.forEach((item) => {
        // Check if the item's Username matches the current user's title
        if (item.username === currentUserTitle) {
          html += `
<tr>
  <td>${item.Title}</td>
  <td>${item.Company}</td>
  <td>
    <button class="delete-button" data-id="${item.ID}">Delete</button>
    <button class="apply-button" data-id="${item.ID}">Apply</button>
  </td>
</tr>`;
        }
      });

      html += `</table>`;

      // Display the table inside the specified <div>
      const allItemsElement = document.getElementById("allItems");
      if (allItemsElement) {
        allItemsElement.innerHTML = html;

        // Add event listeners to delete and apply buttons
        document.querySelectorAll(".delete-button").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const target = event.target as HTMLElement;
            const id = target.dataset.id;
            if (id) {
              await this.deleteItemFromShortlist(id);
              alert("Item Deleted!");
            } else {
              console.error("ID is missing or undefined from button dataset.");
            }
          });
        });

        document.querySelectorAll(".apply-button").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const target = event.target as HTMLElement;
            const id = target.dataset.id;
            if (id) {
              await this.investInItem(id);
              alert("Item Applied!");
            } else {
              console.error("ID is missing or undefined from button dataset.");
            }
          });
        });
      } else {
        console.error("Element with id 'allItems' not found.");
      }
    } catch (error) {
      console.error("Error fetching shortlisted items:", error);
      // Optionally, display an error message or handle the error in another way
    }
  };
  // private handleCountryChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedCountry = event.target.value;
  //   this.setState({
  //     selectedCountry,
  //     selectedIndustry: "",
  //     selectedCompany: "",
  //     selectedFundingInfo: "",
  //     industries: [],
  //     fundingInfos: [],
  //   });
  //   // if (selectedCountry) {
  //   //   this.fetchIndustriesFromSharePointList();
  //   // }
  // };

  private handleCountryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCountry = event.target.value;
    this.setState({
      selectedCountry,
      selectedIndustry: "", // Reset selected industry
      selectedCompany: "", // Reset selected company
      industries: [], // Clear industries
      companies: [], // Clear companies
    });

    if (selectedCountry) {
      await this.fetchIndustriesFromSharePointList();
    }
  };

  private async fetchCountriesFromSharePointList() {
    try {
      const countries: any[] = await this._sp.web.lists
        .getByTitle("Country_GSH")
        .items.select("ID", "Title")();
      this.setState({ countries });
    } catch (e) {
      console.log(e);
    }
  }

  // Temp code
  private async fetchIndustriesFromSharePointList() {
    try {
      const industries: any[] = await this._sp.web.lists
        .getByTitle("IndustryType")
        .items.select("ID", "Title")();
      this.setState({ industries });
    } catch (e) {
      console.error(e);
    }
  }

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

  private handleIndustryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedIndustry = event.target.value;
    this.setState({ selectedIndustry, selectedCompany: "", fundingInfos: [] });
    if (selectedIndustry) {
      this.fetchCompanyFromSharePointList();
    }
  };

  private async fetchCompanyFromSharePointList() {
    try {
      const companies: any[] = await this._sp.web.lists
        .getByTitle("CompanyInfo")
        .items.select("ID", "Title")();
      this.setState({ companies });
    } catch (error) {
      console.error("Error fetching Companies from SharePoint:", error);
    }
  }

  private handleInvestmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedInvestment = event.target.value;
    this.setState({ selectedInvestment });
  };

  private handleCompanyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCompany = event.target.value;
    this.setState({ selectedCompany });
  };

  private async fetchFundingInfosFromSharePointList() {
    try {
      const fundingInfos: any[] = await this._sp.web.lists
        .getByTitle("FundingInfo")
        .items.select("ID", "Title")();
      this.setState({ fundingInfos });
    } catch (e) {
      console.error(e);
    }
  }

  private handleSeedInvestments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ SeedInvestment: event.target.checked }, () => {
      // After updating the state, re-render the filtered items
      this.getAllItems();
    });
  };
}
// private getAllItems = async () => {
//   try {
//     const { selectedCountry } = this.state;

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
//         "SeedInvestment",
//         "Investments"
//       )();

//     let filterQuery = "";
//     if (selectedCountry) {
//       filterQuery += `Country/Title eq '${selectedCountry}'`;
//     }

//     let filteredItems = items;
//     if (this.state.SeedInvestment) {
//       filteredItems = items.filter((item) => item.SeedInvestment);
//     }

//     // Filter based on selected investment amount
//     if (this.state.selectedInvestment) {
//       filteredItems = filteredItems.filter(
//         (item) => item.Investments === this.state.selectedInvestment
//       );
//     }

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

//         // Add event listener to buttons...
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

// Error for filterquery

// private getAllItems = async () => {
//   try {
//     const { selectedCountry } = this.state;

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
//         "SeedInvestment",
//         "Investments"
//       )();

//     let filterQuery = "";
//     console.log(filterQuery);
//     if (selectedCountry) {
//       filterQuery += `Country eq '${selectedCountry}'`;
//     }

//     // Apply the filterQuery
//     let filteredItems = items;

//     if (filterQuery) {
//       filteredItems = items.filter((item) => eval(filterQuery));
//     }

//     if (this.state.SeedInvestment) {
//       filteredItems = items.filter((item) => item.SeedInvestment);
//     }

//     // Filter based on selected investment amount
//     if (this.state.selectedInvestment) {
//       filteredItems = filteredItems.filter(
//         (item) => item.Investments === this.state.selectedInvestment
//       );
//     }

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

//         // Add event listener to buttons...
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

// private getAllItems = async () => {
//   try {
//     const { selectedCountry, selectedIndustry, selectedCompany } = this.state;

//     let filterQuery = "";

//     if (selectedCountry) {
//       filterQuery += `Country eq '${selectedCountry}'`;
//     }

//     if (selectedIndustry) {
//       if (filterQuery) filterQuery += " and ";
//       filterQuery += `Industry eq '${selectedIndustry}'`;
//     }

//     if (selectedCompany) {
//       if (filterQuery) filterQuery += " and ";
//       filterQuery += `Company eq '${selectedCompany}'`;
//     }

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
//         "SeedInvestment",
//         "Investments"
//       )
//       .filter(filterQuery)();

//     let filteredItems = items;
//     if (this.state.SeedInvestment) {
//       filteredItems = items.filter((item) => item.SeedInvestment);
//     }

//     // Filter based on selected investment amount
//     if (this.state.selectedInvestment) {
//       filteredItems = filteredItems.filter(
//         (item) => item.Investments === this.state.selectedInvestment
//       );
//     }

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

//         // Add event listener to buttons...
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

// Tiles + Filter working
