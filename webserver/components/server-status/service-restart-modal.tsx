import axios from "axios";
import { Alert, Button, Label, Modal, Radio, Select } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoSettings } from "react-icons/go";
import { HiExclamationCircle } from "react-icons/hi";

const actions = ["restart", "up", "down", "pause", "unpause"];

export default function ServiceRestartModal() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isSubmitSuccessful },
  } = useForm();

  const [show, setShow] = useState(false);

  const submitForm = (data: any) => {
    return axios({
      url: "/api/docker/restart",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: makePayload(data),
    });
  };

  return (
    <>
      <Button color="gray" onClick={() => setShow(true)} pill={true}>
        <GoSettings className="h-6 w-6" />
      </Button>

      <Modal dismissible={true} show={show} onClose={() => setShow(false)}>
        <Modal.Header>Control Services</Modal.Header>
        <Modal.Body>
          <Alert color="warning" icon={HiExclamationCircle} className="mt-4">
            <span>
              Restarting services while live will cause a stream server
              interruption. It is highly recommended to make sure the active
              stream is not live before submitting this form.
            </span>
          </Alert>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(submitForm)}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="action">Action</Label>
              </div>

              <Select {...register("action")} disabled={isSubmitting}>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <fieldset className="flex flex-col gap-4" id="radio">
                <Label>Service</Label>

                {["all", "srt-relay", "srt-receiver", "noalbs"].map(
                  (serviceName) => (
                    <div className="flex items-center gap-2" key={serviceName}>
                      <Radio
                        id={serviceName}
                        value={serviceName}
                        disabled={isSubmitting}
                        defaultChecked={serviceName === "all"}
                        {...register("service")}
                      />
                      <Label htmlFor={serviceName}>{serviceName}</Label>
                    </div>
                  )
                )}
              </fieldset>
            </div>

            {/* <div>
              <p className="mb-2 text-base">Select which services:</p>

              <div className="flex flex-col gap-4">
                {serviceNames.map((serviceName) => (
                  <div className="flex items-center gap-2" key={serviceName}>
                    <Checkbox
                      id={serviceName}
                      disabled={isSubmitting}
                      {...register(serviceName)}
                    />
                    <Label htmlFor={serviceName}>{serviceName}</Label>
                  </div>
                ))}
              </div>
            </div> */}

            <div className="mt-2">
              <Button
                type="submit"
                color="failure"
                disabled={isSubmitting}
                className="btn btn-primary mr-1"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                {isSubmitting
                  ? "Submitting"
                  : isSubmitSuccessful && !isDirty
                  ? "Submitted"
                  : "Submit now"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

function makePayload(data: any) {
  return JSON.stringify({
    action: data.action,
    services: data.service === "all" ? [] : [data.service],
  });
}
