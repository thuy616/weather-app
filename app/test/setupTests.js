window.google = {
  maps: {
    places: {
      Autocomplete: class {
      }
    }
  }
}

jest.mock('react-google-autocomplete', () => 'Autocomplete')
