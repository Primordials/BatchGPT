import React, { useState } from "react";
import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`,
//   dangerouslyAllowBrowser: true,
// });

let openai = null;

const TextAreaDemo = () => {
  const [openaiInitialized, setopenaiInitialized] = useState(false);

  const [openAiKey, setOpenAiKey] = useState("");
  const [initOpenAiKeyButton, setInitOpenAiKeyButton] = useState(
    "Initialize OpenAI instance"
  );

  const [textArea1Content, setTextArea1Content] = useState(
    "Freehold property\nLeasehold property\nPlant & Machinery\nPlant & m/cy depreciation\nOffice equipment\nOffice equipt depreciation\nFurniture & fixtures\nFurniture & fxts depreciation\nMotor Vehicles\nMotor vehicles depreciation\nInventory\nWork in progress\nFinished goods\nAccounts Receivable Control\nSundry debtors\nOther debtors\nPrepayments\nBank current account\nBank deposit account\nBuilding society account\nPetty cash\nCash receipts\nCompany credit card\nCredit card receipts\nAccounts Payable Control\nSundry creditors\nOther creditors\nAccruals\nSales Tax Control\nPurchase Tax Control\nVAT liability\nPAYE\nNational Insurance\nNet wages control\nPension fund\nLoans\nHire purchase\nCorporation tax\nMortgages\nPreference shares\nReserves\nUndistributed reserves\nProfit & Loss Account\nSales type A\nSales type B\nSales type C\nDiscounts allowed\nSales type D\nSales type E\nSale of Assets\nCredit charges\nMiscellaneous income\nRoyalties received\nCommissions received\nInsurance claims\nRent income\nDistribution & carriage\nMaterials purchased\nMaterials imported\nMiscellaneous purchases\nPackaging\nDiscounts taken\nCarriage\nImport duty\nTransport insurance\nOpening stock\nClosing stock\nProductive Labour\nCost of sales labour\nSub-contractors\nSales commissions\nSales promotion\nAdvertising\nGifts & samples\nPR\nMiscellaneous expenses\nGross wages\nDirectors salaries\nDirectors remuneration\nStaff salaries\nWages regular\nWages casual\nEmployers NI\nEmployers pensions\nRecruitment expenses\nAdjustments\nSSP reclaimed\nSMP reclaimed\nRent\nWater rates\nGeneral rates\nPremises insurance\nElectricity\nGas\nOil\nOther heating costs\nMotor fuel\nMotor repairs\nLicenses\nVehicle insurance\nMiscellaneous motor\nScale charges\nTravelling\nCar hire\nHotels\nUK Entertainment\nOverseas Entertainment\nOverseas travelling\nSubsistence\nPrinting\nPostage & carriage\nTelephone\nTelex/telegram/fax\nOffice stationery\nBooks etc\nLegal fees\nAudit & accountancy fees\nConsultancy fees\nProfessional fees\nEquipment hire\nOffice m/c maintenance\nRepairs & renewals\nCleaning\nLaundry\nPremises expenses\nBank interest paid\nBank charges\nCurrency charges\nLoan interest paid\nHP interest\nCredit charges\nExchange rate variance\nDepreciation\nPlant & m/cy depreciation\nFurniture/fit. depreciation\nVehicle depreciation\nOffice equip. depreciation\nBad debt write off\nBad debt provision\nDonations\nSubscriptions\nClothing costs\nTraining costs\nInsurance\nRefreshments\nSuspense account\nMispostings account"
  );
  const [textArea2Content, setTextArea2Content] = useState(
    "Cash and Cash Equivalents\nAccounts Receivable\nInventory\nPrepaid Expenses\nMarketable Securities\nProperty, Plant, and Equipment\nIntangible Assets\nLong-term Investments\nGoodwill\nDeferred Tax Assets\nAccounts Payable\nShort-term Debt\nAccrued Liabilities\nDeferred Revenue\nLong-term Debt\nDeferred Tax Liabilities\nPension Liabilities\nLease Obligations\nShareholders' Equity"
  );
  const [topTextBoxContent, setTopTextBoxContent] = useState(
    "I have a list of categories, and I need to categorize some assets as an accountant.\nPlease categorize these assets by the most appropriate selection in these following categories\nWhat does asset [object] fall under given these categories?\n[categories]\n\nRETURN ONLY THE CATEGORY!!!, NOTHING ELSE:"
  );
  const [bottomTextBoxContent, setBottomTextBoxContent] = useState("");
  const [bottomTextBoxContent2, setBottomTextBoxContent2] = useState("");

  async function handleOpenAiInit() {
    try {
      await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("The API key is valid.");
            openai = new OpenAI({
              apiKey: `${openAiKey}`,
              dangerouslyAllowBrowser: true,
            });
            setopenaiInitialized(true);
          } else {
            setInitOpenAiKeyButton(
              "Error initializing using this Key, try again with a different key"
            );
            // throw new Error('The API key is not valid.');
          }
        })
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    } catch (error) {
      setInitOpenAiKeyButton(
        "Error initializing using this Key, try again with a different key"
      );
    }
  }

  async function handleButtonClick() {
    const lines = textArea1Content.split("\n");

    let processingOutput = "";
    let finalOutput = "";
    let finalOutput2 = "";

    const hashmap = new Map(); // Create an empty Map

    await processLines(
      lines,
      topTextBoxContent,
      textArea2Content,
      setBottomTextBoxContent,
      hashmap
    );

    // for (let i = 0; i < lines.length; i++) {
    //   let question = topTextBoxContent.replace('[object]', lines[i]);
    //   question = question.replace('[categories]', `${textArea2Content}`);

    //   // Example usage
    //   (async () => {
    //     const answer = await callGPT(question);
    //     processingOutput = processingOutput + lines[i] + " = " +answer + '\n';
    //     hashmap.set(lines[i], answer);
    //     setBottomTextBoxContent(processingOutput);
    //   })();
    // }
    let percentageProcessedBar = 0;
    for (let i = 0; i < lines.length; i++) {
      if (hashmap.has(lines[i])) {
        finalOutput +=
          lines[i] +
          " = " +
          hashmap.get(lines[i]).replace(/\r?\n|\r/g, " ") +
          "\n";
        finalOutput2 += hashmap.get(lines[i]).replace(/\r?\n|\r/g, " ") + "\n";
      } else {
        finalOutput += lines[i] + " = ERROR WHEN CALLING GPT" + "\n";
        finalOutput2 += lines[i] + " = ERROR WHEN CALLING GPT" + "\n";
      }
      percentageProcessedBar++;
    }

    setBottomTextBoxContent(finalOutput);
    setBottomTextBoxContent2(finalOutput2);
  }

  async function processLines(
    lines,
    topTextBoxContent,
    textArea2Content,
    setBottomTextBoxContent,
    hashmap
  ) {
    let processingOutput = ""; // Assuming you have this variable ready

    // Function to update the loading bar
    let percentageProcessedBar = 0;
    const totalLines = lines.length;
    const updateLoadingBar = () => {
      let width = 0;
      if (totalLines > 0) {
        width = (percentageProcessedBar / totalLines) * 100;
      }
      const loadingBar = document.getElementById("loadingBar");
      loadingBar.style.width = width + "%";
    };

    // Map each line to a promise using the async function
    const promises = lines.map(async (line) => {
      let question = topTextBoxContent.replace("[object]", line);
      question = question.replace("[categories]", textArea2Content);

      const answer = await callGPT(question);
      processingOutput += `${line} = ${answer}\n`; // Build the output string
      setBottomTextBoxContent(processingOutput);
      hashmap.set(line, answer); // Update your hashmap

      //loading bar
      // Update progress
      percentageProcessedBar++;
      updateLoadingBar(); // Update the loading bar for each resolved promise

      return { line, answer }; // Return an object with line and answer if needed
    });

    // Wait for all promises to resolve
    await Promise.all(promises)
      .then(() => {
        // Once all lines are processed, update the content
        setBottomTextBoxContent(processingOutput);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("An error occurred in processing lines:", error);
      });
  }

  return (
    <div>
      {openaiInitialized ? (
        <div>
          {/* <div className="textAreasContainer">
            <p>GPT</p>
            <textarea
              type="text"
              value={topTextBoxContent}
              onChange={(e) => setTopTextBoxContent(e.target.value)}
              placeholder="Enter text for Top Text Box"
              rows={7}
              cols={150}
            />
          </div>
          <br />
          <div className="textAreasContainer">
            <p>Objects</p>
            <textarea
              value={textArea1Content}
              onChange={(e) => setTextArea1Content(e.target.value)}
              placeholder="Enter text for Text Area 1"
              rows={20}
              cols={150}
            />
          </div>
          <br />
          <div className="textAreasContainer">
            <p>Categories</p>
            <textarea
              value={textArea2Content}
              onChange={(e) => setTextArea2Content(e.target.value)}
              placeholder="Enter text for Text Area 2"
              rows={10}
              cols={150}
            />
          </div> */}
          <div className="flex flex-col md:flex-row gap-4 mx-5">
            <div className="flex flex-col w-full md:w-1/3">
              <p class="text-white text-1xl md:text-1xl lg:text-1xl font-bold mt-4 mb-2">GPT</p>
              <textarea
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                value={topTextBoxContent}
                onChange={(e) => setTopTextBoxContent(e.target.value)}
                placeholder="Enter text for Top Text Box"
                rows={7}
                cols={150}
              />
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <p class="text-white text-1xl md:text-1xl lg:text-1xl font-bold mt-4 mb-2">Objects</p>
              <textarea
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={textArea1Content}
                onChange={(e) => setTextArea1Content(e.target.value)}
                placeholder="Enter text for Text Area 1"
                rows={20}
                cols={150}
              />
            </div>
            <div className="flex flex-col w-full md:w-1/3">
              <p class="text-white text-1xl md:text-1xl lg:text-1xl font-bold mt-4 mb-2">Categories</p>


              <textarea
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={textArea2Content}
                onChange={(e) => setTextArea2Content(e.target.value)}
                placeholder="Enter text for Text Area 2"
                rows={10}
                cols={150}
              />
            </div>
          </div>

          <br />
          <p class="text-white text-1xl md:text-1xl lg:text-1xl font-bold mt-4 mb-2">Output</p>
          <div class="centerBar">
            <div class="loading-container">
              <div class="loading-bar" id="loadingBar"></div>
            </div>
          </div>

          <div class="w-full my-6 flex justify-center">
            <button
              class="mt-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleButtonClick}
            >
              Execute Function
            </button>
          </div>

          <div className="mx-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <textarea
              className="text-center block w-full md:w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={bottomTextBoxContent}
              placeholder="Output will appear here"
              rows="20"
              readOnly
            />
            <textarea
              className="text-center block w-full md:w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={bottomTextBoxContent2}
              placeholder="Output will appear here"
              rows="20"
              readOnly
            />
          </div>
        </div>
      ) : (
        <div>
          <div class="mt-2">
            <textarea
              class="text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="text"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              placeholder="Put your OpenAiKey in here"
              rows={2}
              cols={60}
            />
          </div>
          <button
            class="mt-2 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleOpenAiInit}
          >
            {initOpenAiKeyButton}
          </button>
        </div>
      )}
    </div>
  );
};

// Function to ask a question to ChatGPT
async function callGPT(question) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: question }],
    model: "gpt-4-0125-preview",
  });

  // Assuming `completion.choices[0]` exists and has a `message` property.
  // Access the `text` property to get the actual response text.
  return completion.choices[0].message.content;
}

export default TextAreaDemo;
