document.addEventListener('DOMContentLoaded', () => {

    // Отримуємо елементи форми
    const form = document.getElementById('register_form');
    const steps = form.querySelectorAll('.step-slider__item');
    const nextBtn = form.querySelector('.step-slider__navigation-next');
    const prevBtn = form.querySelector('.step-slider__navigation-prev');
    const submitBtn = form.querySelector('.step-slider__navigation-next');
    const pagination = document.getElementById('step_slider_pagination')

    let currentStep = 0;

    paginationSliderCreate();

    const paginationItems = document.querySelectorAll('.step-slider__pagination__item');


    // Визначаємо функції валідації
    const validatePassword = pass => {
        const lengthCondition = pass.length >= 5;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /\d/.test(pass);

        return lengthCondition && hasUpperCase && hasLowerCase && hasNumber;
    }
    const validateEmail = email => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    const validateLocation = location => {
        return location.length > 2;
    }

    // Функція для відображення помилок
    const validateStep = () => {
        const isEmail = form.elements[currentStep].type === 'email';
        const isPassword = form.elements[currentStep].type === 'password';
        const isLocation = form.elements[currentStep].id === 'location';

        const error = steps[currentStep].querySelector('.form-group__error');
        const message = steps[currentStep].querySelector('.form-group__message');

        const isValidPassword = validatePassword(form.elements.password.value);
        const isValidEmail = validateEmail(form.elements.email.value);
        const isValidLocation = validateLocation(form.elements.location.value);


        if (!form.elements[currentStep].value) {
            error.textContent = 'This field is required';

            error.classList.add('form-group__error--show');
            message.classList.remove('form-group__message--show');
        } else {
            if(form.elements[currentStep].value) {
                let errorShow = false;

                if (isLocation && !isValidLocation) {
                    error.textContent = 'Length must be min 3';
                    errorShow = true;
                }

                if (isEmail  && !isValidEmail) {
                    error.textContent = 'Email is incorrect';
                    errorShow = true;
                }

                if (isPassword && !isValidPassword) {
                    error.textContent = 'Password must contains lower case letters, upper case letters and number';
                    errorShow = true;
                }

                if (errorShow) {
                    error.classList.add('form-group__error--show');
                    message.classList.remove('form-group__message--show');
                    return false;
                } else {
                    error.classList.remove('form-group__error--show');
                    message.classList.add('form-group__message--show');
                }
                return true;
            }
        }

        return false;
    }

    // Функція відправки даних на сервер
    async function sendData(data) {
        const response = await fetch('http://www.mocky.io/v2/5dfcef48310000ee0ed2c281', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        return response.json();
    }

    // Функція переходу до наступного кроку
    const goToNextStep = () => {

        // Валідація поточного кроку
        if (!validateStep()) {
            return;
        }
        submitButtonStyle();

        if (currentStep < steps.length - 1) {
            // Зміна активного кроку
            currentStep++;
            // Додавання/видалення класів для анімації
            steps[currentStep].classList.add('step-slider__item--active');
            steps[currentStep - 1].classList.remove('step-slider__item--active');

            steps[currentStep - 1].classList.remove('step-slider__item--control-empty');
            emptyControlsListen();
        }

        if (currentStep === steps.length - 1) {
            const { major, age, location, email, password } = form.elements;

            if (validatePassword(password.value)) {
                steps[currentStep].querySelector('.form-group__error').classList.remove('form-group__error--show')
                // Відправка даних на сервер
                sendData({
                    major: major.value,
                    age: age.value,
                    location: location.value,
                    email: email.value,
                    password: password.value
                }).then();
            }
        }

        paginationItems[currentStep].classList.add('--active');
    }

    // Функція переходу до минулого кроку
    const goToPrevStep = () => {
        if(currentStep > 0) {
            currentStep--;

            steps[currentStep].classList.add('step-slider__item--active');
            steps[currentStep + 1].classList.remove('step-slider__item--active');

            emptyControlsListen();
            submitButtonStyle();

            paginationItems[currentStep + 1].classList.remove('--active');
        }
    }

    // Підписка на кліки по кнопках Next
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);

    emptyControlsListen();

    function submitButtonStyle() {
        if (currentStep === steps.length - 1) {
            submitBtn.classList.add('step-slider__navigation-next--submit');
            submitBtn.querySelector('.form-group__btn').innerText = 'Start now';
        } else {
            submitBtn.classList.remove('step-slider__navigation-next--submit');
            submitBtn.querySelector('.form-group__btn').innerText = 'Next step';
        }
    }

    // Функція для прослуховування контрола на пусте поле при init та change
    function emptyControlsListen() {
        checkEmptyControl(Object.values(form.elements)[currentStep]);
        steps[currentStep].addEventListener('change', checkEmptyControl)
    }

    // Функція для перевірки пустого поля контрола і додавання класу
    function checkEmptyControl(control) {
        const clas = 'step-slider__item--control-empty';
        const target = control.target ? control.target : control;

        target.value ? steps[currentStep].classList.remove(clas) : steps[currentStep].classList.add(clas);
    }

    // Функція для створення child елементів в пагінації
    function paginationSliderCreate() {
        steps.forEach((step, index) => {
            const paginationItem = document.createElement('li');
            paginationItem.classList.add('step-slider__pagination__item');
            if(index === currentStep) {
                paginationItem.classList.add('--active');
            }

            pagination.appendChild(paginationItem);
        });
    }
});
