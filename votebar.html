<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: sans-serif; }
  
  .bar-container {
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    overflow: hidden;
    background-color: #eee;
    font-size: 12px; /* Adjust text size here */
    font-weight: bold;
    color: white;
    line-height: 100%; /* Centers text vertically */
    text-align: center;
  }

  .segment {
    height: 100%;
    display: flex;
    align-items: center; /* Vertically center text */
    justify-content: center; /* Horizontally center text */
    transition: width 0.4s ease-in-out;
    overflow: hidden; /* Hides text if bar is too small */
    white-space: nowrap;
  }

  #agree-segment { background-color: #6AA445; width: 50%; }
  #disagree-segment { background-color: #FF7F50; width: 50%; }

</style>
</head>
<body>

<div class="bar-container">
  <div id="agree-segment" class="segment">50%</div>
  <div id="disagree-segment" class="segment">50%</div>
</div>

<script>
  window.onmessage = (event) => {
    if (event.data) {
      // 1. Get the raw numbers
      const agreeVal = Math.round(event.data.agreePercent);
      const disagreeVal = Math.round(event.data.disagreePercent);

      // 2. Update Widths
      document.getElementById("agree-segment").style.width = agreeVal + "%";
      document.getElementById("disagree-segment").style.width = disagreeVal + "%";

      // 3. Update Text Labels
      // If a side is 0%, hide the text so it doesn't look messy
      document.getElementById("agree-segment").innerText = agreeVal > 0 ? agreeVal + "%" : "";
      document.getElementById("disagree-segment").innerText = disagreeVal > 0 ? disagreeVal + "%" : "";
    }
  };
</script>

</body>
</html>
