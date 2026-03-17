// Validação simples do formulário e modal de confirmação
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signup-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const ticketTypeInput = document.getElementById('ticketType');
  const quantityInput = document.getElementById('quantity');
  const submitButton = document.getElementById('submit-button');
  const pricePreview = document.getElementById('price-preview');

  // Atualiza o preview de preço em tempo real
  function updatePricePreview() {
    const ticketType = ticketTypeInput ? ticketTypeInput.value : 'gratuito';
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
    const priceMap = { gratuito: 0, padrao: 49, vip: 99 };
    const totalPrice = (priceMap[ticketType] || 0) * quantity;
    if (pricePreview) pricePreview.textContent = `R$ ${totalPrice.toFixed(2)}`;
  }

  if (ticketTypeInput) ticketTypeInput.addEventListener('change', updatePricePreview);
  if (quantityInput) quantityInput.addEventListener('input', updatePricePreview);
  // Inicializa o preview
  updatePricePreview();
  const modal = document.getElementById('confirm-modal');
  const modalClose = document.getElementById('modal-close');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const ticketType = ticketTypeInput ? ticketTypeInput.value : 'gratuito';
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1;
      let valid = true;

      if (nameInput && !name) {
        nameInput.classList.add('ring', 'ring-red-500');
        valid = false;
      } else if (nameInput) {
        nameInput.classList.remove('ring', 'ring-red-500');
      }

      if (emailInput && !isValidEmail(email)) {
        emailInput.classList.add('ring', 'ring-red-500');
        valid = false;
      } else if (emailInput) {
        emailInput.classList.remove('ring', 'ring-red-500');
      }

      if (!valid) return;

      // Calcular preço com base no tipo
      const priceMap = { gratuito: 0, padrao: 49, vip: 99 };
      const unitPrice = priceMap[ticketType] || 0;
      const totalPrice = unitPrice * quantity;

      // Atualizar preview de preço antes do redirecionamento
      if (pricePreview) {
        pricePreview.textContent = `R$ ${totalPrice.toFixed(2)}`;
      }

      // Desabilitar botão para evitar múltiplos envios
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processando...';
      }

      // Enviar para Forms (se configurado via data-form-url)
      const formUrl = form.dataset.formUrl || '';
      const payload = {
        name,
        email,
        ticketType,
        quantity,
        unitPrice,
        totalPrice,
        eventId: form.querySelector('input[name="eventId"]')?.value || ''
      };

      (async () => {
        try {
          if (formUrl) {
            // Envio genérico em JSON; se precisar de x-www-form-urlencoded para Google Forms, ajustar aqui
            await fetch(formUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
        } catch (err) {
          // Falha no envio ao forms — continuar para checkout local mesmo assim
          console.warn('Erro ao enviar para form endpoint:', err);
        } finally {
          // Redirecionar para a página de checkout com parâmetros (resumidos)
          const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
          const params = new URLSearchParams({
            name: name,
            email: email,
            ticketType: ticketType,
            quantity: String(quantity),
            totalPrice: String(totalPrice),
            orderId: orderId
          });
          // index.html está em /public, checkout.html também (usar caminho relativo)
          window.location.href = './checkout.html?' + params.toString();
        }
      })();
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', function () {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  }

  // Animação de reveal com IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.classList.add('animate-fade-up');
    observer.observe(el);
  });
});
