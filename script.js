document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById('table-body');

    // Generate table rows for 31 days
    for (let i = 1; i <= 31; i++) {
        const row = document.createElement('tr');

        const dayCell = document.createElement('td');
        dayCell.textContent = `اليوم ${i}`;
        row.appendChild(dayCell);

        const checkInCell = document.createElement('td');
        const checkInInput = document.createElement('input');
        checkInInput.type = 'time';
        checkInInput.onchange = calculateDailyHours;
        checkInCell.appendChild(checkInInput);
        row.appendChild(checkInCell);

        const checkOutCell = document.createElement('td');
        const checkOutInput = document.createElement('input');
        checkOutInput.type = 'time';
        checkOutInput.onchange = calculateDailyHours;
        checkOutCell.appendChild(checkOutInput);
        row.appendChild(checkOutCell);

        const hoursCell = document.createElement('td');
        hoursCell.textContent = '0';
        row.appendChild(hoursCell);

        tableBody.appendChild(row);
    }

    // Load saved data
    loadTableData();
});

function calculateDailyHours() {
    const rows = document.querySelectorAll('#working-hours-table tbody tr');
    rows.forEach(row => {
        const checkIn = row.cells[1].querySelector('input').value;
        const checkOut = row.cells[2].querySelector('input').value;
        const hoursCell = row.cells[3];

        if (checkIn && checkOut) {
            const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
            const checkOutDate = new Date(`1970-01-01T${checkOut}:00`);

            let hoursWorked = (checkOutDate - checkInDate) / (1000 * 60 * 60);
            if (hoursWorked < 0) {
                hoursWorked += 24; // Handle overnight shifts
            }
            hoursCell.textContent = hoursWorked.toFixed(2);
        } else {
            hoursCell.textContent = '0';
        }
    });

    // Save data
    saveTableData();
}

function calculateTotalHours() {
    const rows = document.querySelectorAll('#working-hours-table tbody tr');
    let totalHours = 0;

    rows.forEach(row => {
        totalHours += parseFloat(row.cells[3].textContent);
    });

    document.getElementById('total-hours').textContent = `إجمالي الساعات: ${totalHours.toFixed(2)}`;
}

function resetTable() {
    const rows = document.querySelectorAll('#working-hours-table tbody tr');
    rows.forEach(row => {
        row.cells[1].querySelector('input').value = '';
        row.cells[2].querySelector('input').value = '';
        row.cells[3].textContent = '0';
    });

    document.getElementById('total-hours').textContent = 'إجمالي الساعات: 0';
    
    // Clear saved data
    localStorage.removeItem('workingHoursData');
}

function saveTableData() {
    const data = [];
    const rows = document.querySelectorAll('#working-hours-table tbody tr');

    rows.forEach(row => {
        const checkIn = row.cells[1].querySelector('input').value;
        const checkOut = row.cells[2].querySelector('input').value;
        const hours = row.cells[3].textContent;

        data.push({ checkIn, checkOut, hours });
    });

    localStorage.setItem('workingHoursData', JSON.stringify(data));
}

function loadTableData() {
    const data = JSON.parse(localStorage.getItem('workingHoursData'));

    if (data) {
        const rows = document.querySelectorAll('#working-hours-table tbody tr');

        rows.forEach((row, index) => {
            if (data[index]) {
                row.cells[1].querySelector('input').value = data[index].checkIn;
                row.cells[2].querySelector('input').value = data[index].checkOut;
                row.cells[3].textContent = data[index].hours;
            }
        });
    }
}
