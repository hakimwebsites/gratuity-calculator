// UAE Gratuity Calculator Logic
// This is intentionally written simply and commented so you can learn from it.

document.getElementById('calculateBtn').addEventListener('click', function () {
  // 1. Read the values the user typed in
  const basicSalary = parseFloat(document.getElementById('salary').value);
  const years = parseInt(document.getElementById('years').value) || 0;
  const months = parseInt(document.getElementById('months').value) || 0;
  const resignationType = document.getElementById('resignation').value;

  const resultBox = document.getElementById('result');
  const resultAmount = document.getElementById('resultAmount');
  const resultNote = document.getElementById('resultNote');

  // 2. Basic validation
  if (!basicSalary || basicSalary <= 0) {
    alert('Please enter a valid basic salary.');
    return;
  }

  // Convert years + months into total years as a decimal (e.g. 3 years 6 months = 3.5)
  const totalYears = years + (months / 12);

  // 3. Handle the "resigned under 1 year" case — no gratuity by law
  if (resignationType === 'resigned_under1' || totalYears < 1) {
    resultAmount.textContent = '0 AED';
    resultNote.textContent = 'Employees who resign with less than 1 year of service are not entitled to gratuity under UAE law.';
    resultBox.style.display = 'block';
    return;
  }

  // 4. Calculate daily wage (basic salary / 30 days, standard UAE method)
  const dailyWage = basicSalary / 30;

  let gratuity = 0;

  // 5. Apply the tiered calculation
  // First 5 years: 21 days per year
  // Beyond 5 years: 30 days per year
  if (totalYears <= 5) {
    gratuity = dailyWage * 21 * totalYears;
  } else {
    const first5YearsGratuity = dailyWage * 21 * 5;
    const remainingYears = totalYears - 5;
    const remainingGratuity = dailyWage * 30 * remainingYears;
    gratuity = first5YearsGratuity + remainingGratuity;
  }

  // 6. If resigned (not terminated) with 1-5 years, UAE law reduces the payout
  //    Resigned 1-3 years: only 1/3 of gratuity
  //    Resigned 3-5 years: only 2/3 of gratuity
  //    Resigned 5+ years or terminated: full gratuity
  let reductionNote = '';
  if (resignationType === 'resigned_1to3') {
    gratuity = gratuity * (1 / 3);
    reductionNote = 'Reduced to 1/3 because you resigned between 1-3 years of service.';
  } else if (resignationType === 'resigned_3to5') {
    gratuity = gratuity * (2 / 3);
    reductionNote = 'Reduced to 2/3 because you resigned between 3-5 years of service.';
  }

  // 7. Apply the legal cap: gratuity cannot exceed 2 years' total salary
  const twoYearsSalaryCap = basicSalary * 24;
  if (gratuity > twoYearsSalaryCap) {
    gratuity = twoYearsSalaryCap;
    reductionNote += ' Capped at 2 years\' total salary as per UAE law.';
  }

  // 8. Display the result, rounded to 2 decimal places
  resultAmount.textContent = gratuity.toFixed(2) + ' AED';
  resultNote.textContent = reductionNote || 'This is your full gratuity entitlement based on the details provided.';
  resultBox.style.display = 'block';
});
