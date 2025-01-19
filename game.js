document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    const scoreElement = document.getElementById('score');
    const itemsContainer = document.getElementById('items-container');
    const bathTub = document.getElementById('bath-tub');
    const resetButton = document.getElementById('reset-game');
    const instructions = document.querySelector('.instructions');
    const hideInstructionsButton = document.getElementById('hide-instructions');
    
    // Detect if device is touch-enabled
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Bath items with their correct positions and behaviors
    const bathItems = {
        'rubber-duck': { 
            emoji: '🦆', 
            position: 'float',
            sound: '🌊 Splash!',
            action: 'floats in the water'
        },
        'soap': { 
            emoji: '🧼', 
            position: 'bottom',
            sound: '✨ Scrub scrub!',
            action: 'makes bubbles'
        },
        'shampoo': { 
            emoji: '🧴', 
            position: 'side',
            sound: '💧 Squish!',
            action: 'gets squeezed'
        },
        'towel': { 
            emoji: '🧺', 
            position: 'outside',
            sound: '🌟 Pat pat!',
            action: 'dries you off'
        },
        'brush': { 
            emoji: '🧹', 
            position: 'side',
            sound: '✨ Scrub!',
            action: 'helps clean'
        }
    };

    // Update instructions based on device
    if (isTouchDevice) {
        document.querySelectorAll('.instructions p').forEach(p => {
            if (p.textContent.includes('Drag')) {
                p.textContent = p.textContent.replace('Drag', 'Tap');
            }
        });
    }

    // Initialize items
    document.querySelectorAll('.item').forEach(item => {
        if (isTouchDevice) {
            // Remove draggable attribute on touch devices
            item.removeAttribute('draggable');
            // Add tap handler
            item.addEventListener('click', handleTapToPlace);
        } else {
            // Desktop drag and drop
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        }
    });

    // Add drop zone event listeners for desktop
    if (!isTouchDevice) {
        bathTub.addEventListener('dragover', handleDragOver);
        bathTub.addEventListener('drop', handleDrop);
    }

    function handleTapToPlace(e) {
        const itemType = e.target.dataset.item;
        const tubRect = bathTub.getBoundingClientRect();
        
        // Calculate a random position within the bathtub
        const randomX = Math.random() * (tubRect.width - 50); // 50px buffer for item size
        const randomY = Math.random() * (tubRect.height - 50);
        
        // Create and position the new item
        const newItem = document.createElement('div');
        newItem.className = `bath-item ${itemType}`;
        newItem.textContent = bathItems[itemType].emoji;
        
        newItem.style.left = `${randomX}px`;
        newItem.style.top = `${randomY}px`;
        
        // Add to container
        itemsContainer.appendChild(newItem);
        
        // Create splash effect
        createSplash(randomX, randomY, bathItems[itemType].sound);
        
        // Update score
        score += 10;
        scoreElement.textContent = score;
        
        // Add interaction handler
        newItem.addEventListener('click', () => {
            newItem.classList.add('in-use');
            createSplash(randomX, randomY, bathItems[itemType].sound);
            setTimeout(() => newItem.classList.remove('in-use'), 2000);
        });
        
        // Position based on item type
        animateItem(newItem, bathItems[itemType].position);
        
        // Add feedback animation to the shelf item
        e.target.classList.add('tapped');
        setTimeout(() => e.target.classList.remove('tapped'), 200);
    }

    function createSplash(x, y, text) {
        const splash = document.createElement('div');
        splash.className = 'splash';
        splash.textContent = text;
        splash.style.left = `${x}px`;
        splash.style.top = `${y}px`;
        itemsContainer.appendChild(splash);
        setTimeout(() => splash.remove(), 1000);
    }

    // Desktop drag and drop handlers
    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.item);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const itemType = e.dataTransfer.getData('text/plain');
        
        const newItem = document.createElement('div');
        newItem.className = `bath-item ${itemType}`;
        newItem.textContent = bathItems[itemType].emoji;
        
        const rect = bathTub.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        newItem.style.left = `${x}px`;
        newItem.style.top = `${y}px`;
        
        itemsContainer.appendChild(newItem);
        createSplash(x, y, bathItems[itemType].sound);
        
        score += 10;
        scoreElement.textContent = score;
        
        newItem.addEventListener('click', () => {
            newItem.classList.add('in-use');
            createSplash(x, y, bathItems[itemType].sound);
            setTimeout(() => newItem.classList.remove('in-use'), 2000);
        });
        
        animateItem(newItem, bathItems[itemType].position);
    }

    function animateItem(item, position) {
        const tubRect = bathTub.getBoundingClientRect();
        
        switch(position) {
            case 'float':
                item.style.top = `${tubRect.height * 0.3}px`;
                break;
            case 'bottom':
                item.style.bottom = '10px';
                break;
            case 'side':
                item.style.right = '10px';
                break;
            case 'outside':
                item.style.top = '-30px';
                break;
        }
    }

    // Instructions panel handling
    hideInstructionsButton.addEventListener('click', () => {
        instructions.classList.add('hidden');
    });

    // Reset game
    resetButton.addEventListener('click', () => {
        itemsContainer.innerHTML = '';
        score = 0;
        scoreElement.textContent = score;
        instructions.classList.remove('hidden');
    });
});
