/**
 * Obtiene la sesión del usuario desde localStorage de forma segura
 * @returns La sesión del usuario o null si no existe o está corrupta
 */
export function getUserSession() {
  try {
    const session = localStorage.getItem('userSession')
    if (!session) return null
    return JSON.parse(session)
  } catch (error) {
    console.error('Error al parsear sesión del usuario:', error)
    // Limpiar localStorage corrupto
    localStorage.removeItem('userSession')
    localStorage.removeItem('userToken')
    return null
  }
}

/**
 * Guarda la sesión del usuario en localStorage
 * @param session - Datos de la sesión del usuario
 */
export function setUserSession(session: any) {
  try {
    localStorage.setItem('userSession', JSON.stringify(session))
  } catch (error) {
    console.error('Error al guardar sesión del usuario:', error)
  }
}

/**
 * Elimina la sesión del usuario de localStorage
 */
export function clearUserSession() {
  localStorage.removeItem('userSession')
  localStorage.removeItem('userToken')
}
