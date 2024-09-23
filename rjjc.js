(function() {
    const resultElement = document.createElement('p');
    resultElement.id = 'result';
    document.body.appendChild(resultElement);

    const accessDeniedElement = document.createElement('div');
    accessDeniedElement.id = 'accessDenied';
    accessDeniedElement.textContent = '人机验证:请帮助我们验证你的身份，这有助于打击有害行为，维护数据的安全并有利于互联网的发展。';
    accessDeniedElement.style.display = 'none';
    accessDeniedElement.style.backgroundColor = 'white';
    accessDeniedElement.style.position = 'fixed';
    accessDeniedElement.style.top = '0';
    accessDeniedElement.style.left = '0';
    accessDeniedElement.style.width = '100%';
    accessDeniedElement.style.height = '100%';
    accessDeniedElement.style.zIndex = '9999';
    document.body.appendChild(accessDeniedElement);

    let isVerified = false;
    let verificationTimeout;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        return { equation: `${num1} ${operator} ${num2}`, answer: eval(`${num1} ${operator} ${num2}`) };
    }

    function drawCaptcha() {
        accessDeniedElement.innerHTML = ''; // Clear previous captcha elements
        const captcha = generateCaptcha();

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.height = '100%';
        container.style.width = '100%';

        const captchaText = document.createElement('p');
        captchaText.textContent = `请计算：${captcha.equation}`;
        captchaText.style.margin = '10px';
        container.appendChild(captchaText);

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.id = 'userInput';
        userInput.placeholder = '输入计算结果';
        userInput.style.margin = '10px';
        container.appendChild(userInput);

        const validateButton = document.createElement('button');
        validateButton.textContent = '验证';
        validateButton.onclick = () => validateCaptcha(captcha.answer);
        validateButton.style.margin = '10px';
        container.appendChild(validateButton);

        accessDeniedElement.appendChild(container);
    }

    function validateCaptcha(answer) {
        const userInput = document.getElementById('userInput').value;
        if (parseInt(userInput) === answer) {
            isVerified = true;
            accessDeniedElement.style.display = 'none';
            clearTimeout(verificationTimeout);
            localStorage.setItem('verificationPassed', Date.now());
            resultElement.textContent = '验证通过！';
            resultElement.style.color = 'green';
        } else {
            resultElement.textContent = '验证失败，请重试。';
            resultElement.style.color = 'red';
            drawCaptcha(); // Refresh captcha on failure
        }
    }

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let touchDistance = 0;

    if (isMobile) {
        document.body.addEventListener('touchstart', function(event) {
            touchDistance = 0;
        });

        document.body.addEventListener('touchmove', function(event) {
            touchDistance += Math.sqrt(
                Math.pow(event.touches[0].clientX - event.touches[0].target.offsetLeft, 2) +
                Math.pow(event.touches[0].clientY - event.touches[0].target.offsetTop, 2)
            );
        });

        document.body.addEventListener('touchend', function() {
            if (touchDistance > 10) {
                resultElement.textContent = '滑动检测到。可能是人类用户。';
                resultElement.style.color = 'green';
            } else {
                resultElement.textContent = '未检测到显著滑动。开始验证码验证。';
                resultElement.style.color = 'red';
                drawCaptcha();
            }
        });
    } else {
        let mouseMoveDistance = 0;
        let lastMousePosition = { x: 0, y: 0 };

        document.body.addEventListener('mousemove', function(event) {
            const currentMousePosition = { x: event.clientX, y: event.clientY };
            mouseMoveDistance += Math.sqrt(
                Math.pow(currentMousePosition.x - lastMousePosition.x, 2) +
                Math.pow(currentMousePosition.y - lastMousePosition.y, 2)
            );
            lastMousePosition = currentMousePosition;
        });

        document.body.addEventListener('mouseup', function() {
            if (mouseMoveDistance > 10) {
                resultElement.textContent = '鼠标移动检测到。可能是人类用户。';
                resultElement.style.color = 'green';
            } else {
                resultElement.textContent = '未检测到显著鼠标移动。开始验证码验证。';
                resultElement.style.color = 'red';
                drawCaptcha();
            }
        });

        document.body.addEventListener('click', function() {
            if (!isVerified) {
                resultElement.textContent = '点击检测到。可能是人类用户。';
                resultElement.style.color = 'green';
            }
        });
    }

    setTimeout(() => {
        if (!isVerified) {
            accessDeniedElement.style.display = 'block';
            drawCaptcha(); // Automatically show captcha on timeout
        }
    }, 3000);

    const verificationPassed = localStorage.getItem('verificationPassed');
    if (verificationPassed && Date.now() - verificationPassed < 20 * 60 * 1000) {
        isVerified = true;
    }
})();
