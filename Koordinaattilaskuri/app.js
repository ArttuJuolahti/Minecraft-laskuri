$(document).ready(function() {
    // Tallennettujen koordinaattien taulukko
    let savedCoordinates = [];

    // Lataa tallennetut koordinaatit localStoragesta, jos niitä on
    if (localStorage.getItem('savedCoordinates')) {
        savedCoordinates = JSON.parse(localStorage.getItem('savedCoordinates'));
        updateSavedCoordinates(); // Päivitä näkymä
    }

    // Muuntaa Overworld-koordinaatit Nether-koordinaateiksi
    function convertToNether(x, z) {
        return [x / 8, z / 8];
    }

    // Muuntaa Nether-koordinaatit Overworld-koordinaateiksi
    function convertToOverworld(x, z) {
        return [x * 8, z * 8];
    }

    // Päivittää tallennetut koordinaatit listaan ja localStorageen
    function updateSavedCoordinates() {
        const list = $('#saved-coordinates');
        list.empty(); // Tyhjennetään lista ennen uudelleenluontia

        // Käy jokainen tallennettu koordinaatti läpi
        savedCoordinates.forEach((coord, idx) => {
            const [netherX, netherZ] = convertToNether(coord.x, coord.z);
            const $li = $(`
                <li>
                    <strong>${coord.name}</strong>
                    Overworld: (X: ${coord.x}, Z: ${coord.z})<br>
                    Nether:   (X: ${netherX}, Z: ${netherZ}) 
                    <button class="delete-coord" data-idx="${idx}">Poista</button>
                </li>
            `).hide(); // Piilotetaan aluksi, jotta voidaan käyttää fade-animaatiota

            list.append($li);
            $li.fadeIn(300); // Näytetään animaation kera
        });

        // Tallennetaan päivitetty lista localStorageen
        localStorage.setItem('savedCoordinates', JSON.stringify(savedCoordinates));

        // Lisää Poista-nappien toiminnallisuus
        $('.delete-coord').click(function() {
            const idx = $(this).data('idx');

            // Poistetaan koordinaatti fade-animaation jälkeen
            $(this).closest('li').fadeOut(300, function() {
                savedCoordinates.splice(idx, 1); // Poista listasta
                updateSavedCoordinates(); // Päivitä näkymä ja tallennus
            });
        });
    }

    // Päivittää näkymässä Nether-muunnoksen syötettyjen koordinaattien perusteella
    function updateConversionResult() {
        const x = parseInt($('#x-coord').val());
        const z = parseInt($('#z-coord').val());

        if (!isNaN(x) && !isNaN(z)) {
            const [netherX, netherZ] = convertToNether(x, z);
            $('#result').html(
                `Overworld: (X: ${x}, Z: ${z})<br>Nether: (X: ${netherX}, Z: ${netherZ})`
            );
        } else {
            $('#result').text(''); // Tyhjennä, jos ei kelvollisia arvoja
        }
    }

    // Päivitä muunnostulos reaaliaikaisesti kun käyttäjä syöttää arvoja
    $('#x-coord, #z-coord').on('input', updateConversionResult);

    // Tallenna koordinaatit napista
    $('#save-coordinates').click(function() {
        const name = $('#coord-name').val();
        const x = parseInt($('#x-coord').val());
        const z = parseInt($('#z-coord').val());

        // Varmistetaan, että kaikki tarvittavat tiedot on annettu
        if (name && !isNaN(x) && !isNaN(z)) {
            savedCoordinates.push({ name, x, z }); // Lisää uusi koordinaatti
            updateSavedCoordinates(); // Päivitä näkymä ja tallennus

            // Tyhjennä syöttökentät
            $('#coord-name').val('');
            $('#x-coord').val('');
            $('#z-coord').val('');
            $('#result').text(''); // Tyhjennä tulosnäyttö
        }
    });
});
