(() => {
  const KEY = 'lunch-poc-employees-v8';
  const defaults = [
    { cardNumber: '10488', employeeNumber: '10488', employeeName: 'Thomas Nyström' },
    { cardNumber: '10157', employeeNumber: '10157', employeeName: 'Camilla Rantala' },
    { cardNumber: '10254', employeeNumber: '10254', employeeName: 'Lisa Rudbacka' },
    { cardNumber: '10473', employeeNumber: '10473', employeeName: 'Diana Fagerholm' },
    { cardNumber: '10435', employeeNumber: '10435', employeeName: 'Jonas Westerlund' },
    { cardNumber: '10152', employeeNumber: '10152', employeeName: 'Maria Wargh' },
    { cardNumber: '10154', employeeNumber: '10154', employeeName: 'Sinikka Nyfelt' }
  ];

  function employees() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return defaults;
  }

  function render() {
    const container = document.querySelector('[data-demo-card-list]');
    if (!container) return;
    container.replaceChildren(...employees().map(employee => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.card = String(employee.cardNumber || employee.employeeNumber || '');
      button.textContent = button.dataset.card;
      button.title = employee.employeeName || '';
      button.setAttribute('aria-label', `${employee.employeeName || 'Employee'}: ${button.dataset.card}`);
      return button;
    }));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', render)
    : render();
})();
