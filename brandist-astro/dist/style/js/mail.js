document.addEventListener('astro:page-load', () => {
  // Tüm FormSubmit formlarını yakala
  const forms = document.querySelectorAll('form[action^="https://formsubmit.co"]');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Varsayılan sayfa yönlendirmesini durdur

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerText : 'Gönder';

      // Kullanıcıya yüklendiğini göster
      if (btn) {
        btn.innerText = 'Gönderiliyor...';
        btn.disabled = true;
      }

      // FormSubmit requires the /ajax/ API endpoint for AJAX submissions to return proper CORS headers.
      let actionUrl = form.action;
      if (!actionUrl.includes('/ajax/')) {
        actionUrl = actionUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      }

      const formData = new FormData(form);

      // Arka planda AJAX(fetch) ile formu FormSubmit'e gönder
      fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            // Başarılı olursa formu temizle ve süslü alert göster
            form.reset();
            if (typeof Swal !== 'undefined') {
              Swal.fire({
                icon: 'success',
                title: 'Başarılı!',
                text: 'Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.',
                confirmButtonColor: '#25D366'
              });
            } else {
              alert('Mesajınız başarıyla iletildi. Teşekkür ederiz!');
            }
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .catch(error => {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'error',
              title: 'Hata Ouştu',
              text: 'Mesajınız gönderilirken bir sorun yaşandı. Lütfen e-posta veya WhatsApp üzerinden ulaşmayı deneyin.',
              confirmButtonColor: '#d33'
            });
          } else {
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
          }
        })
        .finally(() => {
          // Butonu eski haline getir
          if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
          }
        });
    });
  });
});
