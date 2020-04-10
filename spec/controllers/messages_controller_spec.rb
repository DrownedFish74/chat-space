require 'rails_helper'

describe MessagesController do
  let(:group) { create(:group) }
  let(:user) { create(:user) }
  let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }

  describe '#index' do

    context 'ログインしている場合' do
      before do
        login user
        get :index, params: { group_id: group.id }
      end

      it '@messageに正しい値が入っていること' do
        expect(assigns(:message)).to be_a_new(Message)
      end

      it '@groupに正しい値が入っていること' do
        expect(assigns(:group)).to eq group
      end

      it 'index.html.erb に遷移すること' do
        expect(response).to render_template :index
      end

      context '保存に成功した場合' do
        subject {
        post :create,
        params: params
      }

        it 'メッセージを保存すること' do
          expect{ subject }.to change(Message, :count).by(1)
        end

        it ' メッセージ入力画面へリダイレクトすること' do
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end
      context '保存に失敗した場合' do
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, text: nil, image: nil) } }

        subject {
          post :create,
          params: invalid_params
        }

        it 'メッセージを保存しないこと' do
          expect{ subject }.not_to change(Message, :count)
        end

        it 'index.html.erb へ遷移すること' do
          subject
          expect(response).to render_template :index
        end

      end
    end

    context 'ログインしていない場合' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'ログイン画面にリダイレクトすること' do
        expect(response).to redirect_to(new_user_session_path)
      end
      it ' new.html.hamlに遷移すること' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end