document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("requestForm");
    const submitButton = document.getElementById("requestButton");
    const successMessage = document.getElementById("successMessage");
    const cooldownMessage = document.getElementById("cooldownMessage");

    function checkCooldown() {
        const lastRequestTime = localStorage.getItem("lastRequestTime");
        if (lastRequestTime) {
            const now = new Date().getTime();
            const elapsedTime = now - parseInt(lastRequestTime);

            if (elapsedTime < 15 * 60 * 1000) { // 15 menit dalam milidetik
                const remainingTime = Math.ceil((15 * 60 * 1000 - elapsedTime) / 1000);
                cooldownMessage.style.display = "block";
                submitButton.disabled = true;

                setTimeout(() => {
                    cooldownMessage.style.display = "none";
                    submitButton.disabled = false;
                    localStorage.removeItem("lastRequestTime");
                }, remainingTime * 1000);

                return true;
            }
        }
        return false;
    }

    if (!checkCooldown()) {
        submitButton.disabled = false;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (checkCooldown()) {
            return;
        }

        // Simpan waktu request ke localStorage
        localStorage.setItem("lastRequestTime", new Date().getTime());

        // Tampilkan pesan sukses
        successMessage.style.display = "block";
        submitButton.disabled = true;

        setTimeout(() => {
            form.submit();
        }, 2000);
    });
});
