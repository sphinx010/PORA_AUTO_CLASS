describe('Update info in the my info section', () => {
    let myinfo_button,
        firstName,
        MiddleName,
        lastName,
        Nickname,
        employee_ID_1,
        employee_ID_2,
        Drivers_License_Number,
        Drivers_License_Expiry_Date,
        Nationality,
        Marital_Status,
        DOB,
        Gender,
        save_button,
        usernameField,
        passwordField,
        loginButton,
        login_btn_selector,
        myUserName,
        myPassword

    let values = [
        {
            firstName: 'Ayooluwa',
            middleName: 'Oluwafemi',
            lastName: 'Olorunfemi',
            nickname: 'Ayo300',
            employeeId1: '12345678',
            employeeId2: '123456789',
            driversLicenseNumber: '123456789',
            driversLicenseExpiryDate: '2025-31-12',
            nationality: 'Nigeria',
            maritalStatus: 'Single',
            dob: '1990-31-12',
            gender: 'Male'
        }
    ]

    beforeEach(() => {
        cy.visit('/')
        cy.fixture('ourData').then((data) => {
            myinfo_button = data.my_info_class_selector
            firstName = data.full_name_field[0]
            MiddleName = data.full_name_field[1]
            lastName = data.full_name_field[2]
            Nickname = data.nick_name
            employee_ID_1 = data.employee_Id_fields[0]
            employee_ID_2 = data.employee_Id_fields[1]
            Drivers_License_Number = data.drivers_License_Number_field[0]
            Drivers_License_Expiry_Date = data.drivers_License_Number_field[1]
            Nationality = data.nationality_field
            Marital_Status = data.marital_status
            DOB = data.dOB
            Gender = data.gender
            save_button = data.save_button
            usernameField = data.username_field
            passwordField = data.password_field
            loginButton = data.login_button_Value
            login_btn_selector = data.login_button_class
            myUserName = data.username
            myPassword = data.password
        })

    })

    it('Update info in the my info section', () => {
        //Login
        cy.get(usernameField).type(myUserName)
        cy.get(passwordField).type(myPassword)
        cy.contains(login_btn_selector, loginButton).click({ timeout: 10000 })

        cy.get(myinfo_button).click({ timeout: 10000 })
        cy.contains("Employee Full Name").should('be.visible', { timeout: 10000 })

        // Fill Full Name
        cy.get(firstName).clear().type(values[0].firstName)
        cy.get(MiddleName).clear().type(values[0].middleName)
        cy.get(lastName).clear().type(values[0].lastName)
        cy.get(employee_ID_1).clear().type(values[0].employeeId1)
        cy.get(employee_ID_2).clear().type(values[0].employeeId2)
        cy.get(Drivers_License_Number).clear().type(values[0].driversLicenseNumber)
        cy.get(Drivers_License_Expiry_Date).clear().type(values[0].driversLicenseExpiryDate)
        cy.get(Nationality).scrollIntoView().type(values[0].nationality).click()
        cy.get(Marital_Status).scrollIntoView().type(values[0].maritalStatus).click()
        cy.get(DOB).clear().type(values[0].dob)
        cy.get(Gender).click()
        cy.get(save_button).click({ timeout: 10000 })
    })

})