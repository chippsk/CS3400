class CreateLibraries < ActiveRecord::Migration
  def change
    create_table :libraries do |t|
      t.string :artist
      t.string :album
      t.string :song
      t.integer :year

      t.timestamps
    end
  end
end
