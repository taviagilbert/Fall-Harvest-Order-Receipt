document.addEventListener("DOMContentLoaded", function () {
  const totalEl = document.getElementById("total-amount");

  if (totalEl) {
    const finalAmount = parseFloat(totalEl.dataset.finalAmount);
    const duration = 1200;
    let startTime = null;

    function animateTotal(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentAmount = Math.min(
        (progress / duration) * finalAmount,
        finalAmount,
      );
      totalEl.textContent = `$${currentAmount.toFixed(2)}`;

      if (progress < duration) {
        requestAnimationFrame(animateTotal);
      } else {
        totalEl.textContent = `$${finalAmount.toFixed(2)}`;
      }
    }

    setTimeout(() => {
      requestAnimationFrame(animateTotal);
    }, 550);
  }
});
