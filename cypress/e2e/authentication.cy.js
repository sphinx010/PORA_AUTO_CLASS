describe('Login', () => {


  let yourData, myUserName, myPassword, loginButton,
    passwordField, usernameField, login_btn_selector,
    login_endpoint
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('ourData').then((mydata) => {
      yourData = mydata
      myUserName = mydata.username
      myPassword = mydata.password
      loginButton = yourData.login_button_Value
      passwordField = yourData.password_field
      usernameField = yourData.username_field
      login_btn_selector = yourData.login_button_class
      login_endpoint = yourData.login_endpoint
    })
  })

  it('VALIDATES THAT WEBSITE IS UP AND RUNNING', () => {
    //End TO End Test to confirm the backend login requested was successful
    cy.url().should('include', '/login')
    cy.get('.orangehrm-login-forgot > .oxd-text').contains('Forgot your password?')
      .should('be.visible')
  })


  //this
  it.only('Performs successful login', () => {
    //get username field and type admin
    cy.get(usernameField).type(myUserName)
    cy.get(passwordField).type(myPassword)
    cy.contains(login_btn_selector, loginButton).click({ timeout: 10000 })
    cy.url().should('include', '/dashboard')
  })

  //Making an API CALL to the LOGIN endpoint [Network INTERCEPTION // E2E test for system integration] 
  it('Login with valid credentials', () => {
    cy.intercept('POST', `**/${login_endpoint}`).as('login_valid_request')
    cy.get(usernameField).type(myUserName)
    cy.get(passwordField).type(myPassword)
    cy.contains(login_btn_selector, loginButton).click({ timeout: 10000 })
    cy.wait('@login_valid_request').then((interception) => {
      expect(interception.response.statusCode).to.eql(200 || 302 || 201)
    })
  })
})

describe('sign-up', () => {

})

/*describe('Forgot password', () => {
 beforeEach(()=>{
  cy.visit('/')
 })
})
*/




describe
  //brackets
  (

    //TEST SUITE NAME (Feature under test)
    ''
    ,

    //ARROW FUNCTION
    () => {

      //THIS IS WHERE YOUR TEST SCRIPTS FOR THAT FEATURE WILL RUN
    }
  )