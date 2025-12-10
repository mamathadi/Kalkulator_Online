document.addEventListener('DOMContentLoaded', () => {
    const resultInput = document.getElementById('result');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '';
    let operator = null;
    let previousValue = '';
    let isCalculated = false; // Flag untuk reset setelah perhitungan

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            // --- Logika dan Animasi Tombol ---

            if (button.classList.contains('number') || value === '.') {
                if (isCalculated) {
                    currentInput = ''; // Reset input setelah perhitungan
                    isCalculated = false;
                }
                
                // Mencegah duplikasi titik desimal
                if (value === '.' && currentInput.includes('.')) return;
                
                // Mencegah angka nol di depan kecuali diikuti titik
                if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else {
                    currentInput += value;
                }
                
                updateDisplay(currentInput);

            } else if (button.classList.contains('operator')) {
                
                if (value === 'AC') {
                    // Clear All
                    currentInput = '';
                    previousValue = '';
                    operator = null;
                    isCalculated = false;
                    updateDisplay('0');

                } else if (value === 'DEL') {
                    // Delete (Backspace)
                    currentInput = currentInput.slice(0, -1);
                    updateDisplay(currentInput || '0');

                } else if (value === '%') {
                    // Persentase (hanya bekerja pada currentInput)
                    if (currentInput) {
                        currentInput = (parseFloat(currentInput) / 100).toString();
                        updateDisplay(currentInput);
                        isCalculated = true; 
                    }
                    
                } else {
                    // Operator lainnya (+, -, *, /)
                    if (currentInput === '' && previousValue === '') return;
                    
                    if (previousValue && currentInput && operator) {
                        // Lakukan kalkulasi berantai
                        calculate(); 
                    }

                    if (currentInput !== '') {
                        previousValue = currentInput;
                        currentInput = '';
                    }
                    
                    operator = value;
                    isCalculated = false;
                    updateDisplay(previousValue); // Tampilkan nilai sebelumnya saat operator dipilih
                }

            } else if (button.classList.contains('equal')) {
                calculate();
            }

            // Tambahkan animasi flash pada display
            resultInput.classList.add('input-flash');
            setTimeout(() => {
                resultInput.classList.remove('input-flash');
            }, 100);
        });
    });

    // --- Fungsi Kalkulasi Inti ---

    function calculate() {
        if (!previousValue || !currentInput || !operator) return;

        let result;
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentInput);

        // Mencegah NaN jika input kosong, meskipun sudah dicek di atas
        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Tidak bisa dibagi nol!');
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        // Update state
        currentInput = result.toString();
        previousValue = '';
        operator = null;
        isCalculated = true;
        
        // Animasi hasil akhir
        resultInput.classList.add('result-bounce');
        setTimeout(() => {
            resultInput.classList.remove('result-bounce');
        }, 300);

        updateDisplay(currentInput);
    }

    // --- Fungsi Update Display ---

    function updateDisplay(value) {
        // Batasi panjang tampilan
        if (value.length > 15) {
            value = parseFloat(value).toPrecision(10); // Gunakan notasi ilmiah jika terlalu panjang
        }
        resultInput.value = value;
    }

    // Inisialisasi tampilan
    updateDisplay('0');
});