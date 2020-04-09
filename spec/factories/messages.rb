FactoryBot.define do
  factory :message do
    text {Faker::Lorem.sentence}
    image {File.open("#{Rails.root}/public/uploads/message/test.png")}
    user
    group
  end
end