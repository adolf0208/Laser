cy.wait(2000);
cy.get(".topnav-menu").contains(body.data.sportName).click();
cy.get(".matchname").contains(body.data.event_name).click();
cy.wait(2000);
cy.get("." + body.data.type)
  .invoke("text")
  .then((text) => {
    if (text.includes(body.data.odds)) {
      cy.get("." + body.data.type)
        .contains(body.data.odds)
        .click({ force: true });
      cy.get(".stakesBtns").contains("100").click();
      cy.intercept("POST", "/api/client/store_order").as("betRequest");
      cy.get(".btn-betplace").contains("place bet").click({ force: true });
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