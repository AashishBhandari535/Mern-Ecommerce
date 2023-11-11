import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { toast } from "react-toastify";

// Queries And Mutation
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../slices/userApiSlice";
import ButtonWrapper from "./ButtonWrapper";

const UsersList = () => {
  const { data, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const deleteUserHandler = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err?.data?.errMessage);
    }
  };

  const setUsers = () => {
    const datas = {
      columns: [
        {
          label: "User ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    data?.users.forEach((user) => {
      datas.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        actions: (
          <>
            <ButtonWrapper>
              <Link
                to={`/admin/user/${user._id}`}
                className="btn btn-primary py-1 px-2"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => deleteUserHandler(user._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </ButtonWrapper>
          </>
        ),
      });
    });

    return datas;
  };

  return (
    <Fragment>
      <MetaData title={"All Users"} />
      <div className="row">
        <div className="col-3 col-md-2 col-lg-2">
          <Sidebar />
        </div>

        <div className="col-9 col-md-10 col-lg-10">
          <Fragment>
            <h1 className="my-5">All Users</h1>

            {isLoading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setUsers()}
                className="px-3"
                bordered
                striped
                hover
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
