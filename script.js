let totalScans = 0;
let reportData = "";
function checkScam() {
  totalScans++;
  document.getElementById("scanCount").innerText = totalScans;
  let message = document.getElementById("messageInput").value.toLowerCase();
  let time = new Date().toLocaleTimeString();
  console.log("Sending request:", message);
fetch("http://localhost:5000/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: message
  })
})
.then(data => {
    console.log("Backend Response:", data);

    loadHistory();
})
.catch(error => {
  console.error("Fetch Error:", error);
});
  let scamwords = [
    "hacked",
    "urgently",
    "winner",
    "login",
    "blocked",
    "account",
    "password",
    "prize",
    "bank",
    "pin",
    "otp",
    "click here",
  ];
  let score = 0;
  let foundwords = [];
  for (let word of scamwords) {
    if (message.includes(word)) {
      score++;
      foundwords.push(word);
    }
  }
 

  let mostDangerous = foundwords[0] || "None";
  
  let result = document.getElementById("result");
 result.innerHTML = "Analyzing<span id='dots'></span>";
setTimeout(() => {
  result.style.color = "white";
}, 1500);
  let bankingScam = ["bank", "account", "pin", "otp"];
  let lotteryScam = ["winner", "prize"];
  let credentialTheft = ["password", "login"];
  let panicScam = ["hacked", "urgently", "blocked"];
  let category = "unknown";
  if (
    message.includes("bank") ||
    message.includes("account") ||
    message.includes("pin") ||
    message.includes("otp")
  ) {
    category = "Banking Scam";
  } else if (message.includes("winner") || message.includes("prize")) {
    category = "Lottery Scam";
  } else if (
    message.includes("hacked") ||
    message.includes("urgently") ||
    message.includes("blocked")
  ) {
    category = "Panic Scam";
  } else if (message.includes("password") || message.includes("login")) {
    category = "Credential Theft";
  }

  let history = document.getElementById("history");
  fetch("http://localhost:5000/history")
.then(res => res.json())
.then(data => {
    console.log(data);
});
  if (
    message.includes("http://") ||
    message.includes("https://") ||
    message.includes("www.")
  ) {
    score++;
    foundwords.push("Suspicious Link");
  }
  let warning = [];
  let emailPattern = /\S+@\S+\.\S+/;
  if (emailPattern.test(message)) {
    score++;
    foundwords.push("Suspicious Email");
  }

  if (
    message.includes(".xyz") ||
    message.includes(".top") ||
    message.includes(".click") ||
    message.includes(".club")
  ) {
    score++;
    foundwords.push("Suspicious Domain");
  }
  if (emailPattern.test(message)) {
    warning.push("Contains Email Address");
  }
  if (
    message.includes("http://") ||
    message.includes("https://") ||
    message.includes("www.")
  ) {
    warning.push("Contains Link");
  }
  if (score >= 3) {
    result.style.backgroundColor = "#cc1517";
    result.style.color = "white";
    result.innerHTML = `"Scam Message Detected"; <br><br>
        Risk Score=${score}/10 <br><br>
        Risk Level: High <br><br>
        Category:${category} <br> <br>\
        Scan Time: ${time} <br><br>
        Suspicious Words Found: ${foundwords.length} <br><br>
        Suspicious Words: ${foundwords.join(" ,")} <br> <br>
        Warnings:${warning.join(" , ")} <br><br>
        Most Dangerous Word: ${mostDangerous} <br><br>

        `;
    history.innerHTML += `<li>
        ${message} = Scam
        </li>
        `;
    reportData = `
        "Scam Message Detected"; 

        Risk Score=${score}/10

        Risk Level: High 

        Category:${category} 

        Scan Time: ${time} 

        Suspicious Words Found: ${foundwords.length} 

        Suspicious Words: ${foundwords.join(" ,")} 

        `;
  }
   else if (score >= 1) {
    result.style.backgroundColor = "#FF7900";
    result.style.color = "black";
    result.innerHTML = `
        "Scam Message Detected"; <br><br>
        Risk Score=${score}/10 <br><br>
        Risk Level: Medium <br><br>
        Category:${category} <br> <br>
        Scan Time: ${time} <br><br>
        Suspicious Words Found: ${foundwords.length} <br><br>
        Suspicious Words: ${foundwords.join(" ,")} <br> <br>
         Warnings:${warning.join(" , ")} <br><br>
         Most Dangerous Word: ${mostDangerous} <br><br>
        `;
    history.innerHTML += `<li>
        ${message} = Suspicious
        </li>
        `;
    reportData = `
        "Scam Message Detected";

        Risk Score=${score}/10 

        Risk Level: Medium 

        Category:${category} 

        Scan Time: ${time} 

        Suspicious Words Found: ${foundwords.length} 

        Suspicious Words: ${foundwords.join(" ,")} 
        
         Warnings:${warning.join(" , ")} 
        `;
  } else {
    result.style.backgroundColor = "green";
    result.style.color = "white";
    result.innerHTML = "Message is safe";
    history.innerHTML += `<li>
        ${message} = safe
        </li>
        `;
    reportData = `
        Message is safe; 
        `;
  }
   let riskBar = document.getElementById("riskBar");
riskBar.style.width = (score * 10) + "%";
if(score >= 3){
    riskBar.style.backgroundColor = "red";
}
else if(score >= 1){
    riskBar.style.backgroundColor = "orange";
}
else{
    riskBar.style.backgroundColor = "green";
}
  

}

function downloadReport() {
  if (reportData === "") {
    alert("Please analyze a message first.");
    return;
  }

  let blob = new Blob([reportData], {
    type: "text/plain",
  });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Scam_Report.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function clearHistory() {
  if (confirm("Are you sure you want to clear the history?")) {
    document.getElementById("history").innerHTML = "";
  }
}
function resetForm() {
  document.getElementById("messageInput").value = "";

  document.getElementById("result").innerHTML = "";
}
function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    let btn = document.getElementById("themeBtn");

    if(document.body.classList.contains("dark-mode")){
        btn.innerText = "☀️ Light Mode";
    }
    else{
        btn.innerText = "🌙 Dark Mode";
    }
}
function loadHistory() {

    fetch("http://localhost:5000/history")
    .then(res => res.json())
    .then(data => {

        let history = document.getElementById("history");
      
        history.innerHTML = "";

        data.forEach(scan => {

            history.innerHTML += `
                <li>
                    <strong>${scan.result}</strong><br>
                    ${scan.message}<br>
                    Score: ${scan.riskScore}
                    <hr>
                </li>
            `;

        });

    })
    .catch(err => console.error(err));
    console.log("History Element:", document.getElementById("history"));
}
window.onload = loadHistory;
function reportScam() {
    console.log("Report button clicked");

    let message = document.getElementById("messageInput").value;

  fetch("http://localhost:5000/report", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        message: message,
        category: "User Report"
    })
})
.then(async response => {

    console.log("Status:", response.status);

    const text = await response.text();

    console.log("Response:", text);

})
.catch(err => console.error(err)); }