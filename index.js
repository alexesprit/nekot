import { sign, decode } from 'jsonwebtoken'

configureUserIdInput()
configureInputForm()

fillUsersList()

function configureUserIdInput() {
  const userInput = getUserIdInput()

  userInput.addEventListener('input', (evt) => {
    handleUserIdInput(evt.target.value)
  })

  handleUserIdInput(userInput.value)
}

function configureInputForm() {
  const form = document.querySelector('.input-form')

  form.addEventListener('submit', (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const formData = new FormData(form)
    handleSaveUser(formData)
  })
}

function fillUsersList() {
  const users = getUsers()
  const usersList = document.querySelector('.users')

  const userElements = users.map((user, userIndex) => {
    const [userId, userLabel] = user
    return createUserElement(userId, userLabel, userIndex)
  })

  usersList.innerHTML = ''
  usersList.append(...userElements)

  setUsersHintVisible(users.length > 0)
}

function handleUserIdInput(userId) {
  const userKey = process.env.JWT_USER_KEY
  const jwt = sign(
    {
      aud: process.env.JWT_AUDIENCE,
      [userKey]: userId,
      iss: process.env.JWT_ISSUER,
    },
    process.env.JWT_SECRET,
    {
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: process.env.JWT_EXPIRATION,
    }
  )

  updateJwtOutput(jwt)
}

function handleRemoveUser(userIndex) {
  removeUser(userIndex)
  fillUsersList()
}

function handleSelectUser(userIndex) {
  const users = getUsers()
  const [userId, userLabel] = users[userIndex]

  updateUserInputs(userId, userLabel)
}

function handleSaveUser(formData) {
  const userId = formData.get('user-id')
  const userLabel = formData.get('user-label')

  const safeUserId = encodeURIComponent(userId)
  const safeUserLabel = encodeURIComponent(userLabel)

  addUser(safeUserId, safeUserLabel)
  fillUsersList()
}

function updateUserInputs(userId, userLabel) {
  const userIdInput = getUserIdInput()
  const userLabelInput = getUserLabelInput()

  userIdInput.value = userId
  userLabelInput.value = userLabel

  handleUserIdInput(userId)
}

function updateJwtOutput(jwt) {
  const [rawHeader, rawPayload, rawSignature] = jwt.split('.')
  const { header, payload } = decode(jwt, { complete: true })

  const rawOutputEl = document.querySelector('.output__raw')
  const headerOutputEl = rawOutputEl.querySelector('.output__header')
  const payloadOutputEl = rawOutputEl.querySelector('.output__payload')
  const signatureOutputEl = rawOutputEl.querySelector('.output__signature')

  const jsonOutputEl = document.querySelector('.output__json')
  const jsonHeaderOutput = jsonOutputEl.querySelector('.output__header')
  const jsonPayloadOutput = jsonOutputEl.querySelector('.output__payload')

  headerOutputEl.textContent = rawHeader
  payloadOutputEl.textContent = rawPayload
  signatureOutputEl.textContent = rawSignature

  jsonHeaderOutput.textContent = JSON.stringify(header, null, 2)
  jsonPayloadOutput.textContent = JSON.stringify(payload, null, 2)
}

function setUsersHintVisible(isVisible) {
  const hintEl = document.querySelector('.users-hint')

  hintEl.hidden = !isVisible
}

function addUser(userId, userLabel) {
  const users = getUsers() || []

  for (let i = 0; i < users.length; ++i) {
    const [id] = users[i]
    if (id === userId) {
      users[i] = [userId, userLabel]
      saveUsers(users)

      return
    }
  }

  users.push([userId, userLabel])
  saveUsers(users)
}

function removeUser(userIndex) {
  const users = getUsers()

  users.splice(userIndex, 1)
  saveUsers(users)
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users'))
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

function createUserElement(userId, userLabel, userIndex) {
  const userIdEl = document.createElement('a')
  userIdEl.href = '#'
  userIdEl.classList.add('users__id')
  userIdEl.textContent = userId
  userIdEl.addEventListener('click', (evt) => {
    evt.preventDefault()

    handleSelectUser(userIndex)
  })

  const userLabelEl = document.createElement('span')
  userLabelEl.classList.add('users__label')
  userLabelEl.textContent = userLabel

  const userRemoveEl = document.createElement('span')
  userRemoveEl.classList.add('users__remove')
  userRemoveEl.innerHTML = '&times;'
  userRemoveEl.addEventListener('click', () => {
    handleRemoveUser(userIndex)
  })

  const userContainer = document.createElement('li')
  userContainer.classList.add('users__item')
  userContainer.append(userRemoveEl, userIdEl, userLabelEl)

  return userContainer
}

function getUserIdInput() {
  return document.getElementsByName('user-id')[0]
}

function getUserLabelInput() {
  return document.getElementsByName('user-label')[0]
}
