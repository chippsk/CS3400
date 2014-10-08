json.array!(@libraries) do |library|
  json.extract! library, :id, :artist, :album, :song, :year
  json.url library_url(library, format: :json)
end
