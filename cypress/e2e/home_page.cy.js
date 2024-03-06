// cypress/integration/your-test-file.js
Cypress.on("uncaught:exception", (err, runnable) => {
  console.error("Uncaught Exception:", err.message);
  return false;
});

before(() => {
  cy.visit("https://laser247.online/");
  cy.get(".userloginform").then(($parent) => {
    cy.get($parent).find("input[type='text']").eq(0).type("L7amit2028");
    cy.get($parent).find("input[type='password']").eq(0).type("Munny098");
    cy.get(".btnlogin").contains("Login").click();
  });
});
it("should wait for JSON file data", () => {
  function getData() {
    return cy.request("GET", "http://localhost:8081/get-data");
  }
  function getOutputeData() {
    getData().then((response) => {
      const data = JSON.parse(response.body);
      if (data.data) {
        cy.get(".topnav-menu").contains(data.data.sportName).click();
        cy.get(".matchname").contains(data.data.event_name).click();
        cy.wait(2000);

        cy.get("." + data.data.type)
          .invoke("text")
          .then((text) => {
            if (text.includes(data.data.odds)) {
              cy.get("." + data.data.type)
                .contains(data.data.odds)
                .click({ force: true });
              cy.get(".stakesBtns").contains("100").click();
              cy.intercept("POST", "/api/client/store_order").as("betRequest");
              cy.get(".btn-betplace")
                .contains("place bet")
                .click({ force: true });
              cy.wait("@betRequest", { timeout: 10000 }).then(
                async (interception) => {
                  // Access the request payload
                  const response = interception.response;
                  console.log(response, "reponse");
                  cy.request({
                    method: "POST",
                    url: "http://ec2-13-49-77-105.eu-north-1.compute.amazonaws.com:8081/get-payload",
                    body: {
                      data: response.body.data,
                      name: "Laser",
                    },
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                }
              );
            } else {
              cy.log("odds changed");
              cy.request({
                method: "POST",
                url: "http://ec2-13-49-77-105.eu-north-1.compute.amazonaws.com:8081/get-payload",
                body: {
                  data: {
                    error: "odds changed - Laser",
                  },
                },
                headers: {
                  "Content-Type": "application/json",
                },
              });
            }
          });
      } else {
        console.log("Retrying after 2 seconds...");
        // Retry the request
        cy.wait(2000);
        getOutputeData();
      }
    });
  }
  getOutputeData();
});
